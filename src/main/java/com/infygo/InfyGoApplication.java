package com.infygo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class InfyGoApplication {

    public static void main(String[] args) {
        SpringApplication.run(InfyGoApplication.class, args);
    }
}
