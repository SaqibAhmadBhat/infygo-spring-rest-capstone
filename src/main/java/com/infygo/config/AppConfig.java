package com.infygo.config;

import java.time.Clock;
import java.time.ZoneId;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AppConfig {

    /** A single clock keeps "today" consistent across services and makes date rules testable. */
    @Bean
    public Clock clock(InfyGoProperties properties) {
        return Clock.system(ZoneId.of(properties.timeZone()));
    }

    /** BCrypt is an adaptive, salted hash; the raw password is never stored. */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
