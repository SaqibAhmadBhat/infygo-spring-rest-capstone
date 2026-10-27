package com.infygo.service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.List;
import java.util.regex.Pattern;

import com.infygo.dto.FlightResponse;
import com.infygo.dto.FlightSearchRequest;
import com.infygo.exception.InvalidRequestException;
import com.infygo.repository.FlightDetailsRepository;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FlightService {

    private static final Pattern CITY = Pattern.compile("^[A-Za-z][A-Za-z .'-]{1,49}$");
    private static final Pattern AIRLINE = Pattern.compile("^[A-Za-z0-9][A-Za-z0-9 .&'-]{0,49}$");
    private static final Pattern TIME = Pattern.compile("^([01][0-9]|2[0-3]):[0-5][0-9]$");
    /** Strict ISO yyyy-MM-dd: rejects 2026-02-30 instead of silently adjusting it. */
    private static final DateTimeFormatter ISO_DATE =
            DateTimeFormatter.ofPattern("uuuu-MM-dd").withResolverStyle(ResolverStyle.STRICT);

    private final FlightDetailsRepository flightRepository;
    private final Clock clock;

    public FlightService(FlightDetailsRepository flightRepository, Clock clock) {
        this.flightRepository = flightRepository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<String> getSources() {
        return flightRepository.findDistinctSources();
    }

    @Transactional(readOnly = true)
    public List<String> getDestinations() {
        return flightRepository.findDistinctDestinations();
    }

    @Transactional(readOnly = true)
    public List<FlightResponse> searchFlights(FlightSearchRequest request) {
        FlightSearchCriteria criteria = validate(request);
        return flightRepository
                .findAll(FlightSpecifications.matching(criteria), Sort.by("departureTime", "fare"))
                .stream()
                .map(FlightResponse::from)
                .toList();
    }

    /** Validates and converts raw input. Package-private so the rules can be unit tested with a fixed clock. */
    FlightSearchCriteria validate(FlightSearchRequest r) {
        String source = requireCity(r.source(), "flight.source.invalid");
        String destination = requireCity(r.destination(), "flight.destination.invalid");
        if (source.equalsIgnoreCase(destination)) {
            throw new InvalidRequestException("flight.route.sameCity");
        }

        LocalDate journeyDate = parseJourneyDate(r.journeyDate());

        String airline = trimToNull(r.airline());
        if (airline != null && !AIRLINE.matcher(airline).matches()) {
            throw new InvalidRequestException("flight.airline.invalid");
        }

        String departureFrom = parseTime(r.departureFrom());
        String departureTo = parseTime(r.departureTo());
        if (departureFrom != null && departureTo != null && departureFrom.compareTo(departureTo) > 0) {
            throw new InvalidRequestException("flight.departureTime.range");
        }

        BigDecimal minPrice = parsePrice(r.minPrice());
        BigDecimal maxPrice = parsePrice(r.maxPrice());
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new InvalidRequestException("flight.price.range");
        }

        return new FlightSearchCriteria(source, destination, journeyDate, airline, departureFrom, departureTo,
                minPrice, maxPrice);
    }

    /** The journey date must be strictly after today: a same-day date is not a "future" journey date. */
    private LocalDate parseJourneyDate(String raw) {
        String value = trimToNull(raw);
        if (value == null) {
            throw new InvalidRequestException("flight.journeyDate.format");
        }
        LocalDate date;
        try {
            date = LocalDate.parse(value, ISO_DATE);
        } catch (DateTimeParseException ex) {
            throw new InvalidRequestException("flight.journeyDate.format");
        }
        if (!date.isAfter(LocalDate.now(clock))) {
            throw new InvalidRequestException("flight.journeyDate.notFuture");
        }
        return date;
    }

    private static String requireCity(String raw, String messageKey) {
        String value = trimToNull(raw);
        if (value == null || !CITY.matcher(value).matches()) {
            throw new InvalidRequestException(messageKey);
        }
        return value;
    }

    private static String parseTime(String raw) {
        String value = trimToNull(raw);
        if (value != null && !TIME.matcher(value).matches()) {
            throw new InvalidRequestException("flight.departureTime.invalid");
        }
        return value;
    }

    private static BigDecimal parsePrice(String raw) {
        String value = trimToNull(raw);
        if (value == null) {
            return null;
        }
        try {
            BigDecimal price = new BigDecimal(value);
            if (price.signum() < 0) {
                throw new InvalidRequestException("flight.price.invalid");
            }
            return price;
        } catch (NumberFormatException ex) {
            throw new InvalidRequestException("flight.price.invalid");
        }
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
