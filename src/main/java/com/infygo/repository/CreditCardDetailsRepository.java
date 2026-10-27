package com.infygo.repository;

import com.infygo.entity.CreditCardDetails;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditCardDetailsRepository extends JpaRepository<CreditCardDetails, Integer> {

    boolean existsByTicket_Pnr(Integer pnr);
}
