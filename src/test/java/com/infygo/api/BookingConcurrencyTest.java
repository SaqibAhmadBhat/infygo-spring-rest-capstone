package com.infygo.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import com.infygo.dto.BookingRequest;
import com.infygo.dto.PassengerRequest;
import com.infygo.exception.InsufficientSeatsException;
import com.infygo.service.BookingService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

/** Real threads, real transactions: competing bookings must never oversell a flight. */
class BookingConcurrencyTest extends AbstractIntegrationTest {

    @Autowired
    private BookingService bookingService;

    private static BookingRequest request(int passengers) {
        List<PassengerRequest> list = new ArrayList<>();
        for (int i = 0; i < passengers; i++) {
            list.add(new PassengerRequest("Passenger " + (char) ('A' + i), 25, "Other"));
        }
        return new BookingRequest(list);
    }

    /** Runs the same booking from several threads at once; returns how many succeeded. */
    private int runConcurrently(int threads, int passengersEach, String flightId) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(threads);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<Boolean>> results = new ArrayList<>();
        for (int i = 0; i < threads; i++) {
            results.add(pool.submit(() -> {
                start.await();
                try {
                    bookingService.bookTickets(flightId, "asha01", request(passengersEach));
                    return true;
                } catch (InsufficientSeatsException expected) {
                    return false;
                }
            }));
        }
        start.countDown();
        int successes = 0;
        for (Future<Boolean> result : results) {
            // Any exception other than InsufficientSeatsException fails the test here.
            if (result.get(60, TimeUnit.SECONDS)) {
                successes++;
            }
        }
        pool.shutdown();
        return successes;
    }

    @Test
    void manyCompetingSinglePassengerBookingsCannotOversell() throws Exception {
        saveUser("asha01", "asha@example.com");
        saveFlight("KA101", "Kaveri Air", "Chennai", "Delhi", "06:30", today().plusDays(5), "4500.00", 5);

        int successes = runConcurrently(12, 1, "KA101");

        assertThat(successes).isEqualTo(5);
        assertThat(seatsOf("KA101")).isZero();
        assertThat(ticketRepository.count()).isEqualTo(5);
        assertThat(passengerRepository.count()).isEqualTo(5);
    }

    @Test
    void twoBookingsCompetingForTheSameSeatsOnlyOneWins() throws Exception {
        saveUser("asha01", "asha@example.com");
        saveFlight("NJ303", "Nilgiri Jet", "Chennai", "Delhi", "21:00", today().plusDays(5), "3900.00", 5);

        int successes = runConcurrently(2, 3, "NJ303");

        assertThat(successes).isEqualTo(1);
        assertThat(seatsOf("NJ303")).isEqualTo(2);
        assertThat(ticketRepository.count()).isEqualTo(1);
    }
}
