package com.infygo.exception;

import org.springframework.http.HttpStatus;

/** A referenced user, flight or ticket does not exist (404). */
public class ResourceNotFoundException extends InfyGoException {

    public ResourceNotFoundException(String messageKey, Object... args) {
        super(HttpStatus.NOT_FOUND, "RESOURCE_NOT_FOUND", messageKey, args);
    }
}
