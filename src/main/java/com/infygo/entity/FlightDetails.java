package com.infygo.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Maps the prescribed Flight_Details table. One row is one flight on one date.
 * The fare is DECIMAL(10,2)/BigDecimal instead of the diagram's Double to avoid floating-point money errors.
 */
@Entity
@Table(name = "Flight_Details")
public class FlightDetails {

    @Id
    @Column(name = "flight_id", length = 20)
    private String flightId;

    @Column(name = "airlines", nullable = false, length = 50)
    private String airlines;

    @Column(name = "source", nullable = false, length = 50)
    private String source;

    @Column(name = "destination", nullable = false, length = 50)
    private String destination;

    /** "HH:mm" (24-hour). Zero-padded, so string comparison orders times correctly. */
    @Column(name = "departure_time", nullable = false, length = 5)
    private String departureTime;

    @Column(name = "arrival_time", nullable = false, length = 5)
    private String arrivalTime;

    @Column(name = "flight_available_date", nullable = false)
    private LocalDate flightAvailableDate;

    @Column(name = "fare", nullable = false, precision = 10, scale = 2)
    private BigDecimal fare;

    @Column(name = "seat_count", nullable = false)
    private Integer seatCount;

    protected FlightDetails() {
    }

    public FlightDetails(String flightId, String airlines, String source, String destination,
                         String departureTime, String arrivalTime, LocalDate flightAvailableDate,
                         BigDecimal fare, Integer seatCount) {
        this.flightId = flightId;
        this.airlines = airlines;
        this.source = source;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.flightAvailableDate = flightAvailableDate;
        this.fare = fare;
        this.seatCount = seatCount;
    }

    public String getFlightId() {
        return flightId;
    }

    public String getAirlines() {
        return airlines;
    }

    public String getSource() {
        return source;
    }

    public String getDestination() {
        return destination;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public LocalDate getFlightAvailableDate() {
        return flightAvailableDate;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public Integer getSeatCount() {
        return seatCount;
    }
}
