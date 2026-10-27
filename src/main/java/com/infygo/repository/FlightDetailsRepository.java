package com.infygo.repository;

import java.time.LocalDate;
import java.util.List;

import com.infygo.entity.FlightDetails;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FlightDetailsRepository
        extends JpaRepository<FlightDetails, String>, JpaSpecificationExecutor<FlightDetails> {

    @Query("select distinct f.source from FlightDetails f order by f.source")
    List<String> findDistinctSources();

    @Query("select distinct f.destination from FlightDetails f order by f.destination")
    List<String> findDistinctDestinations();

    boolean existsByFlightAvailableDateAfter(LocalDate date);

    /**
     * Atomic conditional seat reservation. The database decrements seat_count only if enough seats remain,
     * so two concurrent bookings can never both consume the same seats (the row is locked by the UPDATE).
     *
     * @return 1 if the seats were reserved, 0 if the flight does not have enough seats
     */
    @Modifying(flushAutomatically = true)
    @Query("update FlightDetails f set f.seatCount = f.seatCount - :seats "
            + "where f.flightId = :flightId and f.seatCount >= :seats")
    int reserveSeats(@Param("flightId") String flightId, @Param("seats") int seats);
}
