package com.infygo.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Booking body: only the passenger list. Seat count and fare are always derived on the server, so any
 * client-supplied "noOfSeats" or "totalFare" fields are ignored. The upper limit of 10 passengers per
 * booking is a design safety limit, not a PS rule.
 */
public record BookingRequest(
        @NotNull(message = "{booking.passengers.required}")
        @Size(min = 1, max = 10, message = "{booking.passengers.size}")
        List<@NotNull(message = "{booking.passenger.null}") @Valid PassengerRequest> passengers) {
}
