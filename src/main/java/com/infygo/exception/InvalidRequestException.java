package com.infygo.exception;

import org.springframework.http.HttpStatus;

/** Malformed or out-of-range request value (400). */
public class InvalidRequestException extends InfyGoException {

    public InvalidRequestException(String messageKey, Object... args) {
        super(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", messageKey, args);
    }
}
