package com.infygo.api;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.URI;
import java.time.LocalDate;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.test.web.servlet.ResultActions;

class FlightApiTest extends AbstractIntegrationTest {

    private LocalDate journey;

    @BeforeEach
    void seedFlights() {
        journey = today().plusDays(5);
        saveFlight("KA101", "Kaveri Air", "Chennai", "Delhi", "06:30", journey, "4500.00", 10);
        saveFlight("IA202", "Indus Airways", "Chennai", "Delhi", "14:15", journey, "6200.00", 10);
        saveFlight("NJ303", "Nilgiri Jet", "Chennai", "Delhi", "21:00", journey, "3900.00", 10);
        saveFlight("NJ304", "Nilgiri Jet", "Chennai", "Delhi", "23:00", journey, "3000.00", 0);
        saveFlight("KA105", "Kaveri Air", "Chennai", "Delhi", "06:30", journey.plusDays(1), "4500.00", 10);
        saveFlight("IA206", "Indus Airways", "Mumbai", "Bengaluru", "09:00", journey, "3500.00", 10);
    }

    private ResultActions search(String matrix) throws Exception {
        return mockMvc.perform(get(URI.create("/infygo/flights/search;" + matrix)));
    }

    private String route(LocalDate date) {
        return "source=Chennai;destination=Delhi;journeyDate=" + date;
    }

    @Test
    void sourcesComeFromTheDatabaseDistinctAndSorted() throws Exception {
        mockMvc.perform(get("/infygo/flights/sources"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", contains("Chennai", "Mumbai")));
    }

    @Test
    void destinationsComeFromTheDatabaseDistinctAndSorted() throws Exception {
        mockMvc.perform(get("/infygo/flights/destinations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", contains("Bengaluru", "Delhi")));
    }

    @Test
    void emptyFlightTableGivesEmptyLists() throws Exception {
        flightRepository.deleteAll();
        mockMvc.perform(get("/infygo/flights/sources")).andExpect(status().isOk()).andExpect(jsonPath("$", empty()));
        mockMvc.perform(get("/infygo/flights/destinations")).andExpect(status().isOk()).andExpect(jsonPath("$", empty()));
    }

    @Test
    void matrixSearchReturnsMatchingAvailableFlightsSortedByDeparture() throws Exception {
        search(route(journey))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].flightId", contains("KA101", "IA202", "NJ303")))
                .andExpect(jsonPath("$[0].fare").value(4500.0))
                .andExpect(jsonPath("$[0].flightAvailableDate").value(journey.toString()));
    }

    @Test
    void citiesAreMatchedCaseInsensitively() throws Exception {
        search("source=chennai;destination=DELHI;journeyDate=" + journey)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)));
    }

    @Test
    void pathSegmentRouteGivesTheSameResult() throws Exception {
        mockMvc.perform(get(URI.create("/infygo/flights/Chennai/Delhi/" + journey)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].flightId", contains("KA101", "IA202", "NJ303")));
    }

    @Test
    void pathSegmentRouteAcceptsMatrixFilters() throws Exception {
        mockMvc.perform(get(URI.create("/infygo/flights/Chennai/Delhi/" + journey + ";airline=Nilgiri%20Jet")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].flightId", contains("NJ303")));
    }

    @Test
    void noMatchingFlightGivesEmptyList() throws Exception {
        search("source=Delhi;destination=Chennai;journeyDate=" + journey)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", empty()));
    }

    @ParameterizedTest
    @ValueSource(strings = {"20-11-2030", "2030/11/20", "2030-13-01", "2030-02-30", "tomorrow"})
    void badJourneyDateFormatIsRejected(String date) throws Exception {
        search("source=Chennai;destination=Delhi;journeyDate=" + date)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"))
                .andExpect(jsonPath("$.message").value("Journey date must be a valid date in yyyy-MM-dd format."));
    }

    @Test
    void pastJourneyDateIsRejected() throws Exception {
        search(route(today().minusDays(1)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Journey date must be a future date (after today)."));
    }

    @Test
    void todayIsNotAFutureJourneyDate() throws Exception {
        search(route(today())).andExpect(status().isBadRequest());
    }

    @Test
    void invalidSourceIsRejected() throws Exception {
        search("source=Ch3nn@i;destination=Delhi;journeyDate=" + journey).andExpect(status().isBadRequest());
    }

    @Test
    void invalidDestinationIsRejected() throws Exception {
        search("source=Chennai;destination=D3lh!;journeyDate=" + journey)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"))
                .andExpect(jsonPath("$.message").value("Destination city is missing or invalid."));
    }

    @Test
    void sameSourceAndDestinationIsRejected() throws Exception {
        search("source=Delhi;destination=delhi;journeyDate=" + journey).andExpect(status().isBadRequest());
    }

    @Test
    void missingDestinationIsRejected() throws Exception {
        search("source=Chennai;journeyDate=" + journey)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("MISSING_MATRIX_PARAMETER"));
    }

    @Test
    void missingMatrixParameterIsRejected() throws Exception {
        search("source=Chennai;destination=Delhi")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("MISSING_MATRIX_PARAMETER"));
    }

    @Test
    void journeyDateWithSlashesIsRejectedAsBadDateFormatWhenCitiesAreValid() throws Exception {
        search("source=Chennai;destination=Delhi;journeyDate=2030/11/20")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"))
                .andExpect(jsonPath("$.message").value("Journey date must be a valid date in yyyy-MM-dd format."));
    }

    @Test
    void unknownSearchSegmentIsNotFound() throws Exception {
        mockMvc.perform(get(URI.create("/infygo/flights/find;" + route(journey))))
                .andExpect(status().isNotFound());
    }

    @Test
    void airlineFilterIsCaseInsensitive() throws Exception {
        search(route(journey) + ";airline=kaveri%20air")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].flightId", contains("KA101")));
    }

    @Test
    void departureTimeFilters() throws Exception {
        search(route(journey) + ";departureFrom=12:00")
                .andExpect(jsonPath("$[*].flightId", contains("IA202", "NJ303")));
        search(route(journey) + ";departureFrom=06:00;departureTo=15:00")
                .andExpect(jsonPath("$[*].flightId", contains("KA101", "IA202")));
    }

    @Test
    void priceFilters() throws Exception {
        search(route(journey) + ";minPrice=4000;maxPrice=6500")
                .andExpect(jsonPath("$[*].flightId", contains("KA101", "IA202")));
        search(route(journey) + ";maxPrice=3900")
                .andExpect(jsonPath("$[*].flightId", contains("NJ303")));
    }

    @ParameterizedTest
    @ValueSource(strings = {"minPrice=abc", "minPrice=-1", "minPrice=7000;maxPrice=5000",
            "departureFrom=25:00", "departureFrom=9:00", "departureFrom=15:00;departureTo=10:00"})
    void invalidFiltersAreRejected(String filter) throws Exception {
        search(route(journey) + ";" + filter).andExpect(status().isBadRequest());
    }
}
