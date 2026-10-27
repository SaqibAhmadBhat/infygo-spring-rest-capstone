package com.infygo.service;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Validated, typed search input. Optional filters are null when not supplied. */
record FlightSearchCriteria(
        String source,
        String destination,
        LocalDate journeyDate,
        String airline,
        String departureFrom,
        String departureTo,
        BigDecimal minPrice,
        BigDecimal maxPrice) {
}
