package com.infygo.service;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Locale;

import com.infygo.dto.PaymentRequest;
import com.infygo.dto.PaymentResponse;
import com.infygo.entity.CreditCardDetails;
import com.infygo.entity.TicketDetails;
import com.infygo.exception.DuplicateResourceException;
import com.infygo.exception.PaymentValidationException;
import com.infygo.exception.ResourceNotFoundException;
import com.infygo.repository.CreditCardDetailsRepository;
import com.infygo.repository.TicketDetailsRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * MOCK payment: validates synthetic card details and records a masked payment against a ticket.
 * No bank or gateway is contacted. CVV and PIN are validated, then discarded - never stored or logged.
 */
@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    private static final List<String> MONTHS =
            List.of("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC");
    /** Sanity bound for expiry years; real cards are rarely issued for longer. */
    private static final int MAX_YEARS_AHEAD = 20;

    private final TicketDetailsRepository ticketRepository;
    private final CreditCardDetailsRepository paymentRepository;
    private final Clock clock;

    public PaymentService(TicketDetailsRepository ticketRepository, CreditCardDetailsRepository paymentRepository,
                          Clock clock) {
        this.ticketRepository = ticketRepository;
        this.paymentRepository = paymentRepository;
        this.clock = clock;
    }

    @Transactional
    public PaymentResponse pay(PaymentRequest request) {
        TicketDetails ticket = ticketRepository.findById(request.pnr())
                .orElseThrow(() -> new ResourceNotFoundException("ticket.notFound", request.pnr()));
        if (paymentRepository.existsByTicket_Pnr(ticket.getPnr())) {
            throw new DuplicateResourceException("payment.alreadyCompleted", ticket.getPnr());
        }

        int monthIndex = MONTHS.indexOf(request.expiryMonth().trim().toUpperCase(Locale.ROOT));
        int year = Integer.parseInt(request.expiryYear());
        YearMonth now = YearMonth.now(clock);
        // A card is valid until the end of its expiry month.
        if (YearMonth.of(year, monthIndex + 1).isBefore(now)) {
            throw new PaymentValidationException("payment.card.expired");
        }
        if (year > now.getYear() + MAX_YEARS_AHEAD) {
            throw new PaymentValidationException("payment.expiryYear.tooFar");
        }

        // The bill must equal the amount computed at booking time, not an arbitrary client amount.
        if (request.totalBill().compareTo(ticket.getTotalFare()) != 0) {
            throw new PaymentValidationException("payment.totalBill.mismatch", ticket.getTotalFare());
        }

        String masked = mask(request.cardNumber());
        String month = MONTHS.get(monthIndex).charAt(0) + MONTHS.get(monthIndex).substring(1).toLowerCase(Locale.ROOT);
        CreditCardDetails payment = paymentRepository.saveAndFlush(new CreditCardDetails(ticket, masked,
                request.cardHolderName().trim(), month, request.expiryYear(), ticket.getTotalFare(),
                LocalDateTime.now(clock)));

        log.info("Mock payment {} recorded for PNR {} (card ending {})", payment.getPaymentId(), ticket.getPnr(),
                masked.substring(masked.length() - 4));
        return new PaymentResponse("Mock payment successful. No real money was charged.", "SUCCESS",
                payment.getPaymentId(), ticket.getPnr(), masked, payment.getTotalBill(), payment.getPaymentDate());
    }

    /** Keeps only the last four characters, e.g. XXXXXXXXXXXX3456. */
    static String mask(String cardNumber) {
        String last4 = cardNumber.substring(cardNumber.length() - 4);
        return "X".repeat(cardNumber.length() - 4) + last4;
    }
}
