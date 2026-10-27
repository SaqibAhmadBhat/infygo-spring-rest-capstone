package com.infygo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        String message,
        String status,
        Integer paymentId,
        Integer pnr,
        String maskedCardNumber,
        BigDecimal amountPaid,
        LocalDateTime paymentDate) {
}
