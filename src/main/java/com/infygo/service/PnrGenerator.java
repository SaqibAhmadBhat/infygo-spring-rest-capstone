package com.infygo.service;

import java.security.SecureRandom;

import com.infygo.config.InfyGoProperties;

import org.springframework.stereotype.Component;

/**
 * Produces PNR candidates: random integers in the configured range (default 7 digits).
 * The PS does not state an official format; this one fits the diagram's Integer pnr column.
 * Uniqueness is enforced by BookingService (existence check + retry) and by the primary key.
 */
@Component
public class PnrGenerator {

    private final SecureRandom random = new SecureRandom();
    private final int min;
    private final int max;

    public PnrGenerator(InfyGoProperties properties) {
        this.min = properties.pnr().min();
        this.max = properties.pnr().max();
        if (min <= 0 || max <= min) {
            throw new IllegalArgumentException("infygo.pnr.min must be positive and less than infygo.pnr.max");
        }
    }

    public int nextCandidate() {
        return min + random.nextInt(max - min + 1);
    }
}
