package com.infygo.exception;

import org.springframework.http.HttpStatus;

/** Card or bill details rejected by the mock payment rules (400). */
public class PaymentValidationException extends InfyGoException {

    public PaymentValidationException(String messageKey, Object... args) {
        super(HttpStatus.BAD_REQUEST, "PAYMENT_VALIDATION_FAILED", messageKey, args);
    }
}
