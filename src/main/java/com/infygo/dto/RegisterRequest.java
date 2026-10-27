package com.infygo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Registration payload. Password rule from the PS: at least 9 characters with at least one uppercase letter,
 * one lowercase letter and one special character. No digit is required. Max 64 keeps it within BCrypt's limit.
 */
public record RegisterRequest(
        @NotBlank(message = "{user.userId.required}")
        @Pattern(regexp = "^[A-Za-z0-9._-]{3,30}$", message = "{user.userId.invalid}")
        String userId,

        @NotBlank(message = "{user.name.required}")
        @Pattern(regexp = "^[A-Za-z][A-Za-z .'-]{1,59}$", message = "{user.name.invalid}")
        String name,

        @NotBlank(message = "{user.city.required}")
        @Pattern(regexp = "^[A-Za-z][A-Za-z .'-]{1,49}$", message = "{user.city.invalid}")
        String city,

        @NotBlank(message = "{user.email.required}")
        @Size(max = 100, message = "{user.email.invalid}")
        @Email(message = "{user.email.invalid}")
        @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", message = "{user.email.invalid}")
        String email,

        @NotBlank(message = "{user.phone.required}")
        @Pattern(regexp = "^\\+?[0-9]{7,15}$", message = "{user.phone.invalid}")
        String phone,

        @NotBlank(message = "{user.password.required}")
        @Size(min = 9, max = 64, message = "{user.password.size}")
        @Pattern(regexp = ".*[A-Z].*", message = "{user.password.uppercase}")
        @Pattern(regexp = ".*[a-z].*", message = "{user.password.lowercase}")
        @Pattern(regexp = ".*[^A-Za-z0-9\\s].*", message = "{user.password.special}")
        String password) {
}
