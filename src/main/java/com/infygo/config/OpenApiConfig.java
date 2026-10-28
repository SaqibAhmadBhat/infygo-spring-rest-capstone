package com.infygo.config;

import java.util.List;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.parameters.Parameter;
import org.springdoc.core.customizers.OpenApiCustomizer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final List<String> OPTIONAL_FILTERS =
            List.of("airline", "departureFrom", "departureTo", "minPrice", "maxPrice");

    @Bean
    public OpenAPI infyGoOpenApi() {
        return new OpenAPI().info(new Info()
                .title("InfyGo Flight Booking REST API")
                .version("1.0.0")
                .description("Infosys Springboard / Naan Mudhalvan capstone. Search and booking endpoints take "
                        + "matrix parameters, e.g. /infygo/flights/search;source=Chennai;destination=Delhi;"
                        + "journeyDate=2026-12-01. Payment is a MOCK workflow - never use real card data."));
    }

    @Bean
    public OpenApiCustomizer openApiCustomizer() {
        return openApi -> {
            if (openApi.getPaths() != null) {
                // Hide internal wildcard path to prevent duplicate routes in Swagger
                openApi.getPaths().remove("/infygo/flights/{searchKey}/**");

                // Ensure optional filters are properly marked as optional in OpenAPI
                openApi.getPaths().values().forEach(pathItem ->
                        pathItem.readOperations().forEach(operation -> {
                            if (operation.getParameters() != null) {
                                for (Parameter param : operation.getParameters()) {
                                    if (OPTIONAL_FILTERS.contains(param.getName())) {
                                        param.setRequired(false);
                                    }
                                }
                            }
                        })
                );
            }
        };
    }
}
