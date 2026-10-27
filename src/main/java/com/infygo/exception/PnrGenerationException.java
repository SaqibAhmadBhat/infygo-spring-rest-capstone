package com.infygo.exception;

import org.springframework.http.HttpStatus;

/** No unused PNR was found within the configured number of attempts (503, safe to retry). */
public class PnrGenerationException extends InfyGoException {

    public PnrGenerationException() {
        super(HttpStatus.SERVICE_UNAVAILABLE, "PNR_GENERATION_FAILED", "booking.pnr.unavailable");
    }
}
