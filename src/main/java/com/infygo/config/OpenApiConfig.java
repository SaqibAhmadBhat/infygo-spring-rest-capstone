package com.infygo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI infyGoOpenApi() {
        return new OpenAPI().info(new Info()
                .title("InfyGo Flight Booking REST API")
                .version("1.0.0")
                .description("Infosys Springboard / Naan Mudhalvan capstone. Search and booking endpoints take "
                        + "matrix parameters, e.g. /infygo/flights/search;source=Chennai;destination=Delhi;"
                        + "journeyDate=2026-12-01. Payment is a MOCK workflow - never use real card data."));
    }
}
