package com.infygo.controller;

import com.infygo.dto.BookingRequest;
import com.infygo.dto.TicketResponse;
import com.infygo.exception.ResourceNotFoundException;
import com.infygo.service.BookingService;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.MatrixVariable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/infygo")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Requirement 6, canonical matrix-parameter form:
     * POST /infygo/book/tickets;flightId=KA101-261120;userId=asha01   (passengers as JSON body)
     */
    @PostMapping("/book/{bookingKey}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<TicketResponse> bookWithMatrixParameters(
            @Parameter(description = "Must be 'tickets'", example = "tickets")
            @PathVariable("bookingKey") String bookingKey,
            @MatrixVariable(name = "flightId", pathVar = "bookingKey") String flightId,
            @MatrixVariable(name = "userId", pathVar = "bookingKey") String userId,
            @Valid @RequestBody BookingRequest request) {
        if (!"tickets".equals(bookingKey)) {
            throw new ResourceNotFoundException("request.booking.segment", bookingKey);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.bookTickets(flightId, userId, request));
    }

    /** Requirement 6, printed route shape: POST /infygo/book/{FlightId}/{UserId} */
    @PostMapping("/book/{flightId}/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<TicketResponse> bookWithPathSegments(
            @PathVariable("flightId") String flightId,
            @PathVariable("userId") String userId,
            @Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.bookTickets(flightId, userId, request));
    }

    /** Enhancement: PNR lookup, also shows whether the mock payment has been made. */
    @GetMapping("/tickets/{pnr}")
    public TicketResponse getTicket(@PathVariable("pnr") int pnr) {
        return bookingService.getTicket(pnr);
    }
}
