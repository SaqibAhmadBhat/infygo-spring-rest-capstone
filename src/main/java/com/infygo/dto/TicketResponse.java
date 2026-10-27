package com.infygo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.infygo.entity.FlightDetails;
import com.infygo.entity.TicketDetails;

public record TicketResponse(
        Integer pnr,
        String userId,
        String flightId,
        String airlines,
        String source,
        String destination,
        LocalDate bookingDate,
        LocalDate departureDate,
        String departureTime,
        String arrivalTime,
        Integer noOfSeats,
        BigDecimal farePerPassenger,
        BigDecimal totalFare,
        String paymentStatus,
        List<PassengerResponse> passengers) {

    /** Must be called inside a transaction because flight and passengers are lazy associations. */
    public static TicketResponse from(TicketDetails ticket, boolean paid) {
        FlightDetails flight = ticket.getFlight();
        return new TicketResponse(ticket.getPnr(), ticket.getUser().getUserId(), flight.getFlightId(),
                flight.getAirlines(), flight.getSource(), flight.getDestination(), ticket.getBookingDate(),
                ticket.getDepartureDate(), ticket.getDepartureTime(), flight.getArrivalTime(),
                ticket.getNoOfSeats(), flight.getFare(), ticket.getTotalFare(), paid ? "PAID" : "PENDING",
                ticket.getPassengers().stream().map(PassengerResponse::from).toList());
    }
}
