package com.infygo.exception;

import org.springframework.http.HttpStatus;

/** The resource already exists, e.g. a registered e-mail or a completed payment (409). */
public class DuplicateResourceException extends InfyGoException {

    public DuplicateResourceException(String messageKey, Object... args) {
        super(HttpStatus.CONFLICT, "DUPLICATE_RESOURCE", messageKey, args);
    }
}
