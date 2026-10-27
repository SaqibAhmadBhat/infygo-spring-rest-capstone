package com.infygo.repository;

import java.util.List;

import com.infygo.entity.PassengerDetails;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PassengerDetailsRepository extends JpaRepository<PassengerDetails, Integer> {

    List<PassengerDetails> findByTicket_Pnr(Integer pnr);
}
