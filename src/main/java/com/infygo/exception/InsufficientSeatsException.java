package com.infygo.exception;

import org.springframework.http.HttpStatus;

/** The flight does not have enough seats left for the requested passengers (409). */
public class InsufficientSeatsException extends InfyGoException {

    public InsufficientSeatsException(String flightId, int requestedSeats) {
        super(HttpStatus.CONFLICT, "INSUFFICIENT_SEATS", "booking.seats.insufficient", requestedSeats, flightId);
    }
}
