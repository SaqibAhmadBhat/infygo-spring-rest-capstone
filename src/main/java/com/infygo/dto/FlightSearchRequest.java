package com.infygo.dto;

/** Raw search input as received from matrix/path parameters; validated and parsed by FlightService. */
public record FlightSearchRequest(
        String source,
        String destination,
        String journeyDate,
        String airline,
        String departureFrom,
        String departureTo,
        String minPrice,
        String maxPrice) {
}
