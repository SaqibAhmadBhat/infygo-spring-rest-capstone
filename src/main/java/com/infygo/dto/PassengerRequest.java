package com.infygo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record PassengerRequest(
        @NotBlank(message = "{passenger.name.required}")
        @Pattern(regexp = "^[A-Za-z][A-Za-z .'-]{1,59}$", message = "{passenger.name.invalid}")
        String passengerName,

        @NotNull(message = "{passenger.age.required}")
        @Min(value = 0, message = "{passenger.age.invalid}")
        @Max(value = 120, message = "{passenger.age.invalid}")
        Integer passengerAge,

        @NotBlank(message = "{passenger.gender.required}")
        @Pattern(regexp = "(?i)^(male|female|other)$", message = "{passenger.gender.invalid}")
        String passengerGender) {
}
