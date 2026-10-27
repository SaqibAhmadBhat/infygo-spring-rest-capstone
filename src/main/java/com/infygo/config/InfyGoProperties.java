package com.infygo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Application-specific settings, bound from the "infygo.*" properties.
 */
@ConfigurationProperties(prefix = "infygo")
public record InfyGoProperties(
        @DefaultValue("Asia/Kolkata") String timeZone,
        @DefaultValue Pnr pnr,
        @DefaultValue Seed seed) {

    /** PNRs are random integers in [min, max]; maxAttempts bounds the collision-retry loop. */
    public record Pnr(
            @DefaultValue("1000000") int min,
            @DefaultValue("9999999") int max,
            @DefaultValue("10") int maxAttempts) {
    }

    /** When enabled, fictional demo flights are inserted at start-up if no upcoming flights exist. */
    public record Seed(@DefaultValue("false") boolean enabled) {
    }
}
