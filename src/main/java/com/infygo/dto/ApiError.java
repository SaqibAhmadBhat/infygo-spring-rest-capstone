package com.infygo.dto;

import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

/** The single error body returned by every endpoint. Never carries stack traces, SQL or rejected values. */
public record ApiError(
        OffsetDateTime timestamp,
        int status,
        String error,
        String code,
        String message,
        String path,
        @JsonInclude(JsonInclude.Include.NON_EMPTY) List<FieldErrorDetail> fieldErrors) {

    public record FieldErrorDetail(String field, String message) {
    }
}
