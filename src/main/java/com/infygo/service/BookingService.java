package com.infygo.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Locale;
import java.util.regex.Pattern;

import com.infygo.config.InfyGoProperties;
import com.infygo.dto.BookingRequest;
import com.infygo.dto.PassengerRequest;
import com.infygo.dto.TicketResponse;
import com.infygo.entity.FlightDetails;
import com.infygo.entity.PassengerDetails;
import com.infygo.entity.TicketDetails;
import com.infygo.entity.UserDetails;
import com.infygo.exception.InsufficientSeatsException;
import com.infygo.exception.InvalidRequestException;
import com.infygo.exception.PnrGenerationException;
import com.infygo.exception.ResourceNotFoundException;
import com.infygo.repository.CreditCardDetailsRepository;
import com.infygo.repository.FlightDetailsRepository;
import com.infygo.repository.TicketDetailsRepository;
import com.infygo.repository.UserDetailsRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);
    private static final Pattern FLIGHT_ID = Pattern.compile("^[A-Za-z0-9-]{2,20}$");
    private static final Pattern USER_ID = Pattern.compile("^[A-Za-z0-9._-]{3,30}$");

    private final FlightDetailsRepository flightRepository;
    private final UserDetailsRepository userRepository;
    private final TicketDetailsRepository ticketRepository;
    private final CreditCardDetailsRepository paymentRepository;
    private final PnrGenerator pnrGenerator;
    private final Clock clock;
    private final int maxPnrAttempts;

    public BookingService(FlightDetailsRepository flightRepository, UserDetailsRepository userRepository,
                          TicketDetailsRepository ticketRepository, CreditCardDetailsRepository paymentRepository,
                          PnrGenerator pnrGenerator, Clock clock, InfyGoProperties properties) {
        this.flightRepository = flightRepository;
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.paymentRepository = paymentRepository;
        this.pnrGenerator = pnrGenerator;
        this.clock = clock;
        this.maxPnrAttempts = properties.pnr().maxAttempts();
    }

    /**
     * Books tickets as one database transaction: seat reservation, ticket and passenger rows either all
     * commit or all roll back. Any runtime exception after the seat update undoes the seat update too.
     */
    @Transactional
    public TicketResponse bookTickets(String rawFlightId, String rawUserId, BookingRequest request) {
        String flightId = requireIdentifier(rawFlightId, FLIGHT_ID, "booking.flightId.invalid");
        String userId = requireIdentifier(rawUserId, USER_ID, "booking.userId.invalid").toLowerCase(Locale.ROOT);

        UserDetails user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("user.notFound", userId));
        FlightDetails flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new ResourceNotFoundException("flight.notFound", flightId));

        LocalDate today = LocalDate.now(clock);
        if (!flight.getFlightAvailableDate().isAfter(today)) {
            throw new InvalidRequestException("booking.flight.notBookable", flightId);
        }

        // Passenger count comes from the validated list, never from a client-supplied number.
        int seats = request.passengers().size();
        if (flightRepository.reserveSeats(flightId, seats) == 0) {
            throw new InsufficientSeatsException(flightId, seats);
        }

        BigDecimal totalFare = flight.getFare().multiply(BigDecimal.valueOf(seats))
                .setScale(2, RoundingMode.HALF_UP);

        TicketDetails ticket = new TicketDetails(generateUniquePnr(), today, flight, user, seats, totalFare);
        for (PassengerRequest p : request.passengers()) {
            ticket.addPassenger(new PassengerDetails(p.passengerName().trim(), String.valueOf(p.passengerAge()),
                    normaliseGender(p.passengerGender())));
        }
        ticketRepository.saveAndFlush(ticket);

        log.info("Booked PNR {} on flight {} for {} passenger(s)", ticket.getPnr(), flightId, seats);
        return TicketResponse.from(ticket, false);
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicket(int pnr) {
        TicketDetails ticket = ticketRepository.findWithDetailsByPnr(pnr)
                .orElseThrow(() -> new ResourceNotFoundException("ticket.notFound", pnr));
        return TicketResponse.from(ticket, paymentRepository.existsByTicket_Pnr(pnr));
    }

    private int generateUniquePnr() {
        for (int attempt = 1; attempt <= maxPnrAttempts; attempt++) {
            int candidate = pnrGenerator.nextCandidate();
            if (!ticketRepository.existsById(candidate)) {
                return candidate;
            }
            log.warn("PNR collision on attempt {}; retrying", attempt);
        }
        throw new PnrGenerationException();
    }

    private static String requireIdentifier(String raw, Pattern pattern, String messageKey) {
        String value = raw == null ? "" : raw.trim();
        if (!pattern.matcher(value).matches()) {
            throw new InvalidRequestException(messageKey);
        }
        return value;
    }

    private static String normaliseGender(String gender) {
        String g = gender.trim().toLowerCase(Locale.ROOT);
        return Character.toUpperCase(g.charAt(0)) + g.substring(1);
    }
}
