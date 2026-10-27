package com.infygo.dto;

import com.infygo.entity.PassengerDetails;

public record PassengerResponse(Integer passengerId, String passengerName, String passengerAge,
                                String passengerGender) {

    public static PassengerResponse from(PassengerDetails passenger) {
        return new PassengerResponse(passenger.getPassengerId(), passenger.getPassengerName(),
                passenger.getPassengerAge(), passenger.getPassengerGender());
    }
}
