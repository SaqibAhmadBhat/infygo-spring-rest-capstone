package com.infygo.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

/**
 * Mock payment payload. Use synthetic test values only. cvv and apin are validated and then discarded:
 * they are never stored or logged. toString() is overridden so card data cannot leak through logging.
 */
public record PaymentRequest(
        @NotNull(message = "{payment.pnr.required}")
        @Positive(message = "{payment.pnr.invalid}")
        Integer pnr,

        @NotBlank(message = "{payment.cardNumber.required}")
        @Pattern(regexp = "^[A-Za-z0-9]{16}$", message = "{payment.cardNumber.invalid}")
        String cardNumber,

        @NotBlank(message = "{payment.cardHolderName.required}")
        @Pattern(regexp = "^[A-Za-z][A-Za-z .'-]{1,59}$", message = "{payment.cardHolderName.invalid}")
        String cardHolderName,

        @NotBlank(message = "{payment.cvv.required}")
        @Pattern(regexp = "^[0-9]{3}$", message = "{payment.cvv.invalid}")
        String cvv,

        @NotBlank(message = "{payment.apin.required}")
        @Pattern(regexp = "^[0-9]{4,6}$", message = "{payment.apin.invalid}")
        String apin,

        @NotBlank(message = "{payment.expiryMonth.required}")
        @Pattern(regexp = "(?i)^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)$",
                message = "{payment.expiryMonth.invalid}")
        String expiryMonth,

        @NotBlank(message = "{payment.expiryYear.required}")
        @Pattern(regexp = "^[0-9]{4}$", message = "{payment.expiryYear.invalid}")
        String expiryYear,

        @NotNull(message = "{payment.totalBill.required}")
        @DecimalMin(value = "0.01", message = "{payment.totalBill.invalid}")
        @Digits(integer = 8, fraction = 2, message = "{payment.totalBill.invalid}")
        BigDecimal totalBill) {

    @Override
    public String toString() {
        return "PaymentRequest[pnr=" + pnr + ", card=<redacted>]";
    }
}
