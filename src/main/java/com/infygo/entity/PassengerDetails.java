package com.infygo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/**
 * Maps the prescribed Passenger_Details table. ticket_pnr is a foreign key to Ticket_Details.pnr.
 * passenger_age is kept as a string column, as in the diagram; the API validates it as an integer 0-120.
 */
@Entity
@Table(name = "Passenger_Details")
public class PassengerDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passenger_id")
    private Integer passengerId;

    @Column(name = "passenger_name", nullable = false, length = 60)
    private String passengerName;

    @Column(name = "passenger_age", nullable = false, length = 3)
    private String passengerAge;

    @Column(name = "passenger_gender", nullable = false, length = 10)
    private String passengerGender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_pnr", nullable = false)
    private TicketDetails ticket;

    protected PassengerDetails() {
    }

    public PassengerDetails(String passengerName, String passengerAge, String passengerGender) {
        this.passengerName = passengerName;
        this.passengerAge = passengerAge;
        this.passengerGender = passengerGender;
    }

    void setTicket(TicketDetails ticket) {
        this.ticket = ticket;
    }

    public Integer getPassengerId() {
        return passengerId;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public String getPassengerAge() {
        return passengerAge;
    }

    public String getPassengerGender() {
        return passengerGender;
    }

    public TicketDetails getTicket() {
        return ticket;
    }
}
