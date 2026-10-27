package com.infygo.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.URI;

import com.infygo.service.PnrGenerator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Failures after the seat count has been decremented must roll the whole booking back.
 * The PNR generator is replaced so that failures and collisions can be forced deterministically.
 */
class BookingRollbackTest extends AbstractIntegrationTest {

    @MockitoBean
    private PnrGenerator pnrGenerator;

    @BeforeEach
    void seed() {
        saveUser("asha01", "asha@example.com");
        saveFlight("KA101", "Kaveri Air", "Chennai", "Delhi", "06:30", today().plusDays(5), "4500.00", 10);
    }

    private ResultActions book(int passengers) throws Exception {
        return mockMvc.perform(post(URI.create("/infygo/book/tickets;flightId=KA101;userId=asha01"))
                .contentType(MediaType.APPLICATION_JSON).content(json(BookingApiTest.passengers(passengers))));
    }

    @Test
    void failureAfterSeatReservationRollsBackEverything() throws Exception {
        when(pnrGenerator.nextCandidate()).thenThrow(new IllegalStateException("simulated failure"));

        book(3).andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.code").value("INTERNAL_ERROR"))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred. Please try again later."));

        assertThat(seatsOf("KA101")).isEqualTo(10);
        assertThat(ticketRepository.count()).isZero();
        assertThat(passengerRepository.count()).isZero();
    }

    @Test
    void pnrCollisionIsRetriedWithANewCandidate() throws Exception {
        when(pnrGenerator.nextCandidate()).thenReturn(1234567);
        book(1).andExpect(status().isCreated()).andExpect(jsonPath("$.pnr").value(1234567));

        when(pnrGenerator.nextCandidate()).thenReturn(1234567, 7654321);
        book(1).andExpect(status().isCreated()).andExpect(jsonPath("$.pnr").value(7654321));
        assertThat(ticketRepository.count()).isEqualTo(2);
    }

    @Test
    void exhaustedPnrAttemptsRollBackTheSeatReservation() throws Exception {
        when(pnrGenerator.nextCandidate()).thenReturn(1234567);
        book(2).andExpect(status().isCreated());
        assertThat(seatsOf("KA101")).isEqualTo(8);

        book(2).andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.code").value("PNR_GENERATION_FAILED"));

        assertThat(seatsOf("KA101")).isEqualTo(8);
        assertThat(ticketRepository.count()).isEqualTo(1);
        assertThat(passengerRepository.count()).isEqualTo(2);
    }
}
