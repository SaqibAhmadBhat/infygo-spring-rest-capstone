package com.infygo.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "{login.userId.required}") String userId,
        @NotBlank(message = "{login.password.required}") String password) {
}
