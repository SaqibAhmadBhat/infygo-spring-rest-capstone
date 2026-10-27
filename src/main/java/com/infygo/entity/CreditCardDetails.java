package com.infygo.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

/**
 * Maps the prescribed Creditcard_Details table for the MOCK payment workflow.
 *
 * Schema additions (documented in docs/ER_DIAGRAM.md): payment_id surrogate key, pnr foreign key to the paid
 * ticket (unique: one payment per ticket) and payment_date. The diagram's cvv and apin columns are kept for
 * schema compatibility but this application never writes them: they are always NULL.
 * card_number stores only a masked value such as XXXXXXXXXXXX3456.
 */
@Entity
@Table(name = "Creditcard_Details")
public class CreditCardDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pnr", nullable = false, unique = true)
    private TicketDetails ticket;

    @Column(name = "card_number", nullable = false, length = 16)
    private String maskedCardNumber;

    @Column(name = "card_holder_name", nullable = false, length = 60)
    private String cardHolderName;

    @Column(name = "expiry_month", nullable = false, length = 3)
    private String expiryMonth;

    @Column(name = "expiry_year", nullable = false, length = 4)
    private String expiryYear;

    @Column(name = "total_bill", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalBill;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    protected CreditCardDetails() {
    }

    public CreditCardDetails(TicketDetails ticket, String maskedCardNumber, String cardHolderName,
                             String expiryMonth, String expiryYear, BigDecimal totalBill,
                             LocalDateTime paymentDate) {
        this.ticket = ticket;
        this.maskedCardNumber = maskedCardNumber;
        this.cardHolderName = cardHolderName;
        this.expiryMonth = expiryMonth;
        this.expiryYear = expiryYear;
        this.totalBill = totalBill;
        this.paymentDate = paymentDate;
    }

    public Integer getPaymentId() {
        return paymentId;
    }

    public TicketDetails getTicket() {
        return ticket;
    }

    public String getMaskedCardNumber() {
        return maskedCardNumber;
    }

    public String getCardHolderName() {
        return cardHolderName;
    }

    public String getExpiryMonth() {
        return expiryMonth;
    }

    public String getExpiryYear() {
        return expiryYear;
    }

    public BigDecimal getTotalBill() {
        return totalBill;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }
}
