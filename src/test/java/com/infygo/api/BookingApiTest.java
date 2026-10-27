package com.infygo.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.infygo.entity.TicketDetails;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

class BookingApiTest extends AbstractIntegrationTest {

    @BeforeEach
    void seed() {
        saveUser("asha01", "asha@example.com");
        saveFlight("KA101", "Kaveri Air", "Chennai", "Delhi", "06:30", today().plusDays(5), "4500.00", 10);
        saveFlight("NJ303", "Nilgiri Jet", "Chennai", "Delhi", "21:00", today().plusDays(5), "3900.00", 2);
        saveFlight("IA999", "Indus Airways", "Chennai", "Delhi", "08:00", today(), "5000.00", 10);
    }

    static Map<String, Object> passenger(String name, Object age, String gender) {
        Map<String, Object> p = new HashMap<>();
        p.put("passengerName", name);
        p.put("passengerAge", age);
        p.put("passengerGender", gender);
        return p;
    }

    static Map<String, Object> passengers(int count) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            list.add(passenger("Passenger " + (char) ('A' + i), 30 + i, i % 2 == 0 ? "Female" : "male"));
        }
        Map<String, Object> body = new HashMap<>();
        body.put("passengers", list);
        return body;
    }

    private ResultActions bookMatrix(String flightId, String userId, Object body) throws Exception {
        return mockMvc.perform(post(URI.create("/infygo/book/tickets;flightId=" + flightId + ";userId=" + userId))
                .contentType(MediaType.APPLICATION_JSON).content(json(body)));
    }

    private ResultActions bookPath(String flightId, String userId, Object body) throws Exception {
        return mockMvc.perform(post(URI.create("/infygo/book/" + flightId + "/" + userId))
                .contentType(MediaType.APPLICATION_JSON).content(json(body)));
    }

    @Test
    void onePassengerBookingWithMatrixParameters() throws Exception {
        bookMatrix("KA101", "asha01", passengers(1))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.pnr").isNumber())
                .andExpect(jsonPath("$.flightId").value("KA101"))
                .andExpect(jsonPath("$.userId").value("asha01"))
                .andExpect(jsonPath("$.noOfSeats").value(1))
                .andExpect(jsonPath("$.totalFare").value(4500.0))
                .andExpect(jsonPath("$.departureDate").value(today().plusDays(5).toString()))
                .andExpect(jsonPath("$.departureTime").value("06:30"))
                .andExpect(jsonPath("$.paymentStatus").value("PENDING"))
                .andExpect(jsonPath("$.passengers", hasSize(1)));

        assertThat(seatsOf("KA101")).isEqualTo(9);
        assertThat(ticketRepository.count()).isEqualTo(1);
        assertThat(passengerRepository.count()).isEqualTo(1);
    }

    @Test
    void multiPassengerBookingPersistsTicketAndPassengers() throws Exception {
        String response = bookPath("KA101", "asha01", passengers(3))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.noOfSeats").value(3))
                .andExpect(jsonPath("$.passengers", hasSize(3)))
                .andReturn().getResponse().getContentAsString();
        int pnr = objectMapper.readTree(response).get("pnr").asInt();

        assertThat(pnr).isBetween(1_000_000, 9_999_999);
        assertThat(seatsOf("KA101")).isEqualTo(7);
        TicketDetails ticket = ticketRepository.findById(pnr).orElseThrow();
        assertThat(ticket.getTotalFare()).isEqualByComparingTo(new BigDecimal("13500.00"));
        assertThat(ticket.getNoOfSeats()).isEqualTo(3);
        assertThat(ticket.getBookingDate()).isEqualTo(today());
        assertThat(passengerRepository.findByTicket_Pnr(pnr)).hasSize(3)
                .extracting("passengerGender").containsExactlyInAnyOrder("Female", "Male", "Female");
    }

    @Test
    void clientSuppliedSeatCountAndFareAreIgnored() throws Exception {
        Map<String, Object> body = passengers(2);
        body.put("noOfSeats", 1);
        body.put("totalFare", 1);
        bookMatrix("KA101", "asha01", body)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.noOfSeats").value(2))
                .andExpect(jsonPath("$.totalFare").value(9000.0));
    }

    @Test
    void eachBookingGetsADifferentPnr() throws Exception {
        String first = bookMatrix("KA101", "asha01", passengers(1)).andReturn().getResponse().getContentAsString();
        String second = bookMatrix("KA101", "asha01", passengers(1)).andReturn().getResponse().getContentAsString();
        assertThat(objectMapper.readTree(first).get("pnr").asInt())
                .isNotEqualTo(objectMapper.readTree(second).get("pnr").asInt());
    }

    @Test
    void unknownFlightIsNotFound() throws Exception {
        bookMatrix("XX000", "asha01", passengers(1))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("RESOURCE_NOT_FOUND"));
    }

    @Test
    void unknownUserIsNotFound() throws Exception {
        bookMatrix("KA101", "ghost99", passengers(1)).andExpect(status().isNotFound());
        assertThat(seatsOf("KA101")).isEqualTo(10);
    }

    @Test
    void invalidFlightIdIsRejected() throws Exception {
        bookMatrix("KA*101", "asha01", passengers(1)).andExpect(status().isBadRequest());
    }

    @Test
    void missingMatrixUserIdIsRejected() throws Exception {
        mockMvc.perform(post(URI.create("/infygo/book/tickets;flightId=KA101"))
                        .contentType(MediaType.APPLICATION_JSON).content(json(passengers(1))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("MISSING_MATRIX_PARAMETER"));
    }

    @Test
    void emptyPassengerListIsRejected() throws Exception {
        bookMatrix("KA101", "asha01", Map.of("passengers", List.of()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("passengers")));
        bookMatrix("KA101", "asha01", Map.of())
                .andExpect(status().isBadRequest());
        assertThat(ticketRepository.count()).isZero();
    }

    @Test
    void invalidPassengerCreatesNoPartialTicket() throws Exception {
        Map<String, Object> body = Map.of("passengers", List.of(
                passenger("Valid Person", 40, "Female"),
                passenger("", 200, "unknown")));
        bookMatrix("KA101", "asha01", body)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("passengers[1].passengerName")))
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("passengers[1].passengerAge")))
                .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("passengers[1].passengerGender")));
        assertThat(ticketRepository.count()).isZero();
        assertThat(passengerRepository.count()).isZero();
        assertThat(seatsOf("KA101")).isEqualTo(10);
    }

    @Test
    void insufficientSeatsIsAConflictAndChangesNothing() throws Exception {
        bookMatrix("NJ303", "asha01", passengers(3))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("INSUFFICIENT_SEATS"));
        assertThat(seatsOf("NJ303")).isEqualTo(2);
        assertThat(ticketRepository.count()).isZero();
    }

    @Test
    void exactlyTheRemainingSeatsCanBeBooked() throws Exception {
        bookMatrix("NJ303", "asha01", passengers(2)).andExpect(status().isCreated());
        assertThat(seatsOf("NJ303")).isZero();
        bookMatrix("NJ303", "asha01", passengers(1)).andExpect(status().isConflict());
    }

    @Test
    void flightDepartingTodayCannotBeBooked() throws Exception {
        bookMatrix("IA999", "asha01", passengers(1)).andExpect(status().isBadRequest());
        assertThat(seatsOf("IA999")).isEqualTo(10);
    }

    @Test
    void ticketCanBeLookedUpByPnr() throws Exception {
        String response = bookMatrix("KA101", "asha01", passengers(2)).andReturn().getResponse().getContentAsString();
        int pnr = objectMapper.readTree(response).get("pnr").asInt();

        mockMvc.perform(get("/infygo/tickets/" + pnr))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pnr").value(pnr))
                .andExpect(jsonPath("$.passengers", hasSize(2)));
        mockMvc.perform(get("/infygo/tickets/1"))
                .andExpect(status().isNotFound());
    }
}
