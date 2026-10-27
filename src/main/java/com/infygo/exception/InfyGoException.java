package com.infygo.exception;

import java.util.Arrays;
import java.util.Objects;

import org.springframework.http.HttpStatus;

/**
 * Base class for expected business errors. The human-readable text lives in ValidationMessages.properties;
 * the exception only carries the message key and its arguments (converted to strings so that numbers such
 * as PNRs are not formatted with thousands separators).
 */
public abstract class InfyGoException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;
    private final String messageKey;
    private final Object[] messageArgs;

    protected InfyGoException(HttpStatus status, String errorCode, String messageKey, Object... args) {
        super(messageKey);
        this.status = status;
        this.errorCode = errorCode;
        this.messageKey = messageKey;
        this.messageArgs = Arrays.stream(args).map(Objects::toString).toArray();
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public Object[] getMessageArgs() {
        return messageArgs.clone();
    }
}
