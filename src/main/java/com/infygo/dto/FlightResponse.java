package com.infygo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.infygo.entity.FlightDetails;

public record FlightResponse(
        String flightId,
        String airlines,
        String source,
        String destination,
        LocalDate flightAvailableDate,
        String departureTime,
        String arrivalTime,
        BigDecimal fare,
        Integer seatCount) {

    public static FlightResponse from(FlightDetails flight) {
        return new FlightResponse(flight.getFlightId(), flight.getAirlines(), flight.getSource(),
                flight.getDestination(), flight.getFlightAvailableDate(), flight.getDepartureTime(),
                flight.getArrivalTime(), flight.getFare(), flight.getSeatCount());
    }
}
