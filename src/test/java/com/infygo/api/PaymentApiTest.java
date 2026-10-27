package com.infygo.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasItems;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.infygo.dto.BookingRequest;
import com.infygo.dto.PassengerRequest;
import com.infygo.service.BookingService;

import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

/** All card values here are synthetic test data. */
@ExtendWith(OutputCaptureExtension.class)
class PaymentApiTest extends AbstractIntegrationTest {

    private static final String CARD = "TESTCARD00003456";
    private static final String CVV = "913";
    private static final String PIN = "2468";

    @Autowired
    private BookingService bookingService;

    private int pnr;
    private YearMonth now;

    @BeforeEach
    void bookTicket() {
        saveUser("asha01", "asha@example.com");
        saveFlight("KA101", "Kaveri Air", "Chennai", "Delhi", "06:30", today().plusDays(5), "4500.00", 10);
        pnr = bookingService.bookTickets("KA101", "asha01", new BookingRequest(List.of(
                new PassengerRequest("Asha Kumar", 34, "Female"),
                new PassengerRequest("Ravi Kumar", 36, "Male")))).pnr();
        now = YearMonth.now(clock);
    }

    private Map<String, Object> payment() {
        Map<String, Object> body = new HashMap<>();
        body.put("pnr", pnr);
        body.put("cardNumber", CARD);
        body.put("cardHolderName", "Asha Kumar");
        body.put("cvv", CVV);
        body.put("apin", PIN);
        body.put("expiryMonth", "Dec");
        body.put("expiryYear", String.valueOf(now.getYear() + 2));
        body.put("totalBill", 9000.00);
        return body;
    }

    private ResultActions pay(Map<String, Object> body) throws Exception {
        return mockMvc.perform(post("/infygo/payment").contentType(MediaType.APPLICATION_JSON).content(json(body)));
    }

    @Test
    void validSyntheticPaymentIsRecordedMasked(CapturedOutput output) throws Exception {
        pay(payment())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.pnr").value(pnr))
                .andExpect(jsonPath("$.maskedCardNumber").value("XXXXXXXXXXXX3456"))
                .andExpect(jsonPath("$.amountPaid").value(9000.0));

        Map<String, Object> row = jdbcTemplate.queryForMap("SELECT * FROM Creditcard_Details WHERE pnr = ?", pnr);
        assertThat(row.get("CARD_NUMBER")).isEqualTo("XXXXXXXXXXXX3456");
        assertThat(row.get("CVV")).isNull();
        assertThat(row.get("APIN")).isNull();
        assertThat(row.values()).doesNotContain(CARD, CVV, PIN);

        assertThat(output.getAll()).doesNotContain(CARD).doesNotContain("cvv=").doesNotContain("\"cvv\"")
                .doesNotContain("apin=").doesNotContain("\"apin\"");

        mockMvc.perform(get("/infygo/tickets/" + pnr)).andExpect(jsonPath("$.paymentStatus").value("PAID"));
    }

    @Test
    void monthIsCaseInsensitive() throws Exception {
        Map<String, Object> body = payment();
        body.put("expiryMonth", "dEC");
        pay(body).andExpect(status().isCreated());
    }

    @Test
    void missingFieldsAreRejected() throws Exception {
        pay(Map.of())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItems("pnr", "cardNumber", "cardHolderName",
                        "cvv", "apin", "expiryMonth", "expiryYear", "totalBill")));
        assertThat(paymentRepository.count()).isZero();
    }

    @ParameterizedTest
    @ValueSource(strings = {"12", "1234", "12a", ""})
    void cvvMustBeExactlyThreeDigits(String cvv) throws Exception {
        Map<String, Object> body = payment();
        body.put("cvv", cvv);
        pay(body).andExpect(status().isBadRequest()).andExpect(jsonPath("$.fieldErrors[*].field", hasItem("cvv")));
    }

    @ParameterizedTest
    @ValueSource(strings = {"13", "January", "Ja", "Dez"})
    void monthMustBeAThreeLetterMonth(String month) throws Exception {
        Map<String, Object> body = payment();
        body.put("expiryMonth", month);
        pay(body).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("expiryMonth")));
    }

    @ParameterizedTest
    @ValueSource(strings = {"TESTCARD0000345", "TESTCARD000034567", "TESTCARD-0003456", "TESTCARD 0003456"})
    void cardNumberMustBe16Alphanumerics(String cardNumber) throws Exception {
        Map<String, Object> body = payment();
        body.put("cardNumber", cardNumber);
        pay(body).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("cardNumber")));
    }

    @Test
    void cardExpiredLastYearIsRejected() throws Exception {
        Map<String, Object> body = payment();
        body.put("expiryYear", String.valueOf(now.getYear() - 1));
        pay(body).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("PAYMENT_VALIDATION_FAILED"))
                .andExpect(jsonPath("$.message").value("The card has expired."));
    }

    @Test
    void cardExpiredEarlierThisYearIsRejected() throws Exception {
        Assumptions.assumeTrue(now.getMonthValue() > 1, "No earlier month exists in January");
        Map<String, Object> body = payment();
        body.put("expiryMonth", now.minusMonths(1).getMonth().name().substring(0, 3));
        body.put("expiryYear", String.valueOf(now.getYear()));
        pay(body).andExpect(status().isBadRequest()).andExpect(jsonPath("$.message").value("The card has expired."));
    }

    @Test
    void cardExpiringThisMonthIsStillValid() throws Exception {
        Map<String, Object> body = payment();
        body.put("expiryMonth", now.getMonth().name().substring(0, 3));
        body.put("expiryYear", String.valueOf(now.getYear()));
        pay(body).andExpect(status().isCreated());
    }

    @Test
    void totalBillMustMatchTheTicket() throws Exception {
        Map<String, Object> body = payment();
        body.put("totalBill", 100.00);
        pay(body).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("PAYMENT_VALIDATION_FAILED"));
        assertThat(paymentRepository.count()).isZero();
    }

    @Test
    void unknownTicketIsNotFound() throws Exception {
        Map<String, Object> body = payment();
        body.put("pnr", 1);
        pay(body).andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RESOURCE_NOT_FOUND"));
    }

    @Test
    void ticketCannotBePaidTwice() throws Exception {
        pay(payment()).andExpect(status().isCreated());
        pay(payment()).andExpect(status().isConflict());
        assertThat(paymentRepository.count()).isEqualTo(1);
    }
}
