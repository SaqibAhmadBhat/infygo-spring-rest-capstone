package com.infygo.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import com.infygo.entity.FlightDetails;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

/** Builds the flight search query; optional filters add predicates only when present. */
final class FlightSpecifications {

    private FlightSpecifications() {
    }

    static Specification<FlightDetails> matching(FlightSearchCriteria c) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(cb.lower(root.<String>get("source")), c.source().toLowerCase(Locale.ROOT)));
            predicates.add(cb.equal(cb.lower(root.<String>get("destination")),
                    c.destination().toLowerCase(Locale.ROOT)));
            predicates.add(cb.equal(root.<LocalDate>get("flightAvailableDate"), c.journeyDate()));
            predicates.add(cb.greaterThan(root.<Integer>get("seatCount"), 0));

            if (c.airline() != null) {
                predicates.add(cb.equal(cb.lower(root.<String>get("airlines")),
                        c.airline().toLowerCase(Locale.ROOT)));
            }
            if (c.departureFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.<String>get("departureTime"), c.departureFrom()));
            }
            if (c.departureTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.<String>get("departureTime"), c.departureTo()));
            }
            if (c.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.<BigDecimal>get("fare"), c.minPrice()));
            }
            if (c.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.<BigDecimal>get("fare"), c.maxPrice()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
