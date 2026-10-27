package com.infygo.service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.infygo.entity.FlightDetails;
import com.infygo.repository.FlightDetailsRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Inserts FICTIONAL demo flights (invented airlines) dated relative to today, so a demo never runs on
 * expired data. Runs only when infygo.seed.enabled=true and no upcoming flights exist. Disabled in tests.
 */
@Component
@ConditionalOnProperty(prefix = "infygo.seed", name = "enabled", havingValue = "true")
public class DemoDataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DemoDataSeeder.class);
    private static final DateTimeFormatter ID_DATE = DateTimeFormatter.ofPattern("yyMMdd");

    private static final String[][] ROUTES = {
            {"Chennai", "Delhi"}, {"Delhi", "Chennai"}, {"Chennai", "Mumbai"}, {"Mumbai", "Bengaluru"},
            {"Bengaluru", "Kolkata"}, {"Hyderabad", "Chennai"}, {"Delhi", "Mumbai"}};
    /** code, airline name, departure, arrival, base fare */
    private static final String[][] SERVICES = {
            {"KA", "Kaveri Air", "06:30", "09:20", "4500.00"},
            {"IA", "Indus Airways", "14:15", "17:05", "6200.00"},
            {"NJ", "Nilgiri Jet", "21:00", "23:45", "3900.00"}};
    private static final int[] DAY_OFFSETS = {3, 7, 14, 30};

    private final FlightDetailsRepository flightRepository;
    private final Clock clock;

    public DemoDataSeeder(FlightDetailsRepository flightRepository, Clock clock) {
        this.flightRepository = flightRepository;
        this.clock = clock;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        LocalDate today = LocalDate.now(clock);
        if (flightRepository.existsByFlightAvailableDateAfter(today)) {
            return;
        }
        List<FlightDetails> flights = new ArrayList<>();
        for (int r = 0; r < ROUTES.length; r++) {
            for (int s = 0; s < SERVICES.length; s++) {
                for (int offset : DAY_OFFSETS) {
                    LocalDate date = today.plusDays(offset);
                    String id = SERVICES[s][0] + (101 + r * 10 + s) + "-" + date.format(ID_DATE);
                    if (!flightRepository.existsById(id)) {
                        flights.add(new FlightDetails(id, SERVICES[s][1], ROUTES[r][0], ROUTES[r][1],
                                SERVICES[s][2], SERVICES[s][3], date, new BigDecimal(SERVICES[s][4]), 60));
                    }
                }
            }
        }
        flightRepository.saveAll(flights);
        log.info("Seeded {} fictional demo flights", flights.size());
    }
}
