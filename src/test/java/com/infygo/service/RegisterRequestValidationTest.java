package com.infygo.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;
import java.util.stream.Collectors;

import com.infygo.dto.RegisterRequest;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

/** Unit test of the registration rules and of message resolution from ValidationMessages.properties. */
class RegisterRequestValidationTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    private static RegisterRequest withPassword(String password) {
        return new RegisterRequest("asha01", "Asha Kumar", "Chennai", "asha@example.com", "9876543210", password);
    }

    private Set<String> passwordMessages(String password) {
        return validator.validate(withPassword(password)).stream()
                .filter(v -> v.getPropertyPath().toString().equals("password"))
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.toSet());
    }

    @ParameterizedTest
    @ValueSource(strings = {"Secure@Pass", "Abcdefgh#", "NoDigits#Here", "Mixed Case!1"})
    void acceptsPasswordsMeetingTheRule(String password) {
        assertThat(validator.validate(withPassword(password))).isEmpty();
    }

    @Test
    void reportsEachMissingCharacterClassWithItsOwnMessage() {
        assertThat(passwordMessages("Abcdef@1")).containsExactly(
                "Password must be at least 9 characters long (maximum 64).");
        assertThat(passwordMessages("abcdefgh@")).containsExactly(
                "Password must contain at least one uppercase letter.");
        assertThat(passwordMessages("ABCDEFGH@")).containsExactly(
                "Password must contain at least one lowercase letter.");
        assertThat(passwordMessages("Abcdefghi")).containsExactly(
                "Password must contain at least one special character.");
    }

    @Test
    void acceptsInternationalPhoneFormats() {
        RegisterRequest request = new RegisterRequest("asha01", "Asha Kumar", "Chennai", "asha@example.com",
                "+447911123456", "Secure@Pass");
        assertThat(validator.validate(request)).isEmpty();
    }
}
