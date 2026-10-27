package com.infygo.repository;

import java.util.Optional;

import com.infygo.entity.TicketDetails;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketDetailsRepository extends JpaRepository<TicketDetails, Integer> {

    @EntityGraph(attributePaths = {"flight", "user", "passengers"})
    Optional<TicketDetails> findWithDetailsByPnr(Integer pnr);
}
