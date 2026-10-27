package com.infygo.exception;

import org.springframework.http.HttpStatus;

/** Same response for an unknown user and a wrong password, so account existence is not revealed (401). */
public class InvalidCredentialsException extends InfyGoException {

    public InvalidCredentialsException() {
        super(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "login.invalidCredentials");
    }
}
