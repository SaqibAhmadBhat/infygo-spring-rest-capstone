package com.infygo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import com.infygo.dto.FlightSearchRequest;
import com.infygo.exception.InvalidRequestException;
import com.infygo.repository.FlightDetailsRepository;

import org.junit.jupiter.api.Test;

/** Date and filter rules with a fixed clock: "today" is 2026-10-26 in Asia/Kolkata. */
class FlightSearchValidationTest {

    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");
    private final Clock clock = Clock.fixed(Instant.parse("2026-10-26T10:00:00Z"), IST);
    private final FlightService service = new FlightService(mock(FlightDetailsRepository.class), clock);

    private static FlightSearchRequest request(String date) {
        return new FlightSearchRequest("Chennai", "Delhi", date, null, null, null, null, null);
    }

    @Test
    void tomorrowIsAccepted() {
        assertThat(service.validate(request("2026-10-27")).journeyDate()).isEqualTo(LocalDate.of(2026, 10, 27));
    }

    @Test
    void todayAndPastDatesAreRejected() {
        assertThatThrownBy(() -> service.validate(request("2026-10-26")))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessage("flight.journeyDate.notFuture");
        assertThatThrownBy(() -> service.validate(request("2026-10-25")))
                .hasMessage("flight.journeyDate.notFuture");
    }

    @Test
    void todayIsJudgedInTheConfiguredTimeZone() {
        // 2026-10-26T20:00Z is already 2026-10-27 01:30 in India, so the 27th is "today" there.
        Clock lateUtc = Clock.fixed(Instant.parse("2026-10-26T20:00:00Z"), IST);
        FlightService lateService = new FlightService(mock(FlightDetailsRepository.class), lateUtc);
        assertThatThrownBy(() -> lateService.validate(request("2026-10-27")))
                .hasMessage("flight.journeyDate.notFuture");
    }

    @Test
    void impossibleCalendarDatesAreRejected() {
        assertThatThrownBy(() -> service.validate(request("2027-02-29")))
                .hasMessage("flight.journeyDate.format");
        assertThat(service.validate(request("2028-02-29")).journeyDate()).isEqualTo(LocalDate.of(2028, 2, 29));
    }

    @Test
    void filtersAreParsedAndTrimmed() {
        FlightSearchCriteria c = service.validate(new FlightSearchRequest(" Chennai ", "Delhi", "2026-11-01",
                " Kaveri Air ", "06:00", "12:30", "1000", "5000.50"));
        assertThat(c.source()).isEqualTo("Chennai");
        assertThat(c.airline()).isEqualTo("Kaveri Air");
        assertThat(c.minPrice()).isEqualByComparingTo("1000");
        assertThat(c.maxPrice()).isEqualByComparingTo(new BigDecimal("5000.50"));
    }

    @Test
    void blankOptionalFiltersAreIgnored() {
        FlightSearchCriteria c = service.validate(new FlightSearchRequest("Chennai", "Delhi", "2026-11-01",
                "", " ", null, "", null));
        assertThat(c.airline()).isNull();
        assertThat(c.departureFrom()).isNull();
        assertThat(c.minPrice()).isNull();
    }
}
