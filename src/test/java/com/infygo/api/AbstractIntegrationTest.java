package com.infygo.api;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.infygo.entity.FlightDetails;
import com.infygo.entity.UserDetails;
import com.infygo.repository.CreditCardDetailsRepository;
import com.infygo.repository.FlightDetailsRepository;
import com.infygo.repository.PassengerDetailsRepository;
import com.infygo.repository.TicketDetailsRepository;
import com.infygo.repository.UserDetailsRepository;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Full Spring context on an in-memory H2 database built by the real Flyway migration.
 * Every test starts from empty tables and creates exactly the data it needs.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    protected static final String VALID_PASSWORD = "Secure@Pass";

    @Autowired protected MockMvc mockMvc;
    @Autowired protected ObjectMapper objectMapper;
    @Autowired protected JdbcTemplate jdbcTemplate;
    @Autowired protected FlightDetailsRepository flightRepository;
    @Autowired protected UserDetailsRepository userRepository;
    @Autowired protected TicketDetailsRepository ticketRepository;
    @Autowired protected PassengerDetailsRepository passengerRepository;
    @Autowired protected CreditCardDetailsRepository paymentRepository;
    @Autowired protected PasswordEncoder passwordEncoder;
    @Autowired protected Clock clock;

    @BeforeEach
    void cleanDatabase() {
        jdbcTemplate.update("DELETE FROM Creditcard_Details");
        jdbcTemplate.update("DELETE FROM Passenger_Details");
        jdbcTemplate.update("DELETE FROM Ticket_Details");
        jdbcTemplate.update("DELETE FROM Flight_Details");
        jdbcTemplate.update("DELETE FROM User_Details");
    }

    protected LocalDate today() {
        return LocalDate.now(clock);
    }

    protected FlightDetails saveFlight(String id, String airline, String source, String destination,
                                       String departure, LocalDate date, String fare, int seats) {
        return flightRepository.save(new FlightDetails(id, airline, source, destination, departure, "23:59",
                date, new BigDecimal(fare), seats));
    }

    protected UserDetails saveUser(String userId, String email) {
        return userRepository.save(new UserDetails(userId, "Asha Kumar", "Chennai", email, "9876543210",
                passwordEncoder.encode(VALID_PASSWORD)));
    }

    protected int seatsOf(String flightId) {
        return flightRepository.findById(flightId).orElseThrow().getSeatCount();
    }

    protected String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }
}
