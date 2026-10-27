package com.infygo.controller;

import java.util.List;

import com.infygo.dto.FlightResponse;
import com.infygo.dto.FlightSearchRequest;
import com.infygo.exception.ResourceNotFoundException;
import com.infygo.service.FlightService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.MatrixVariable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/infygo/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    /** Requirement 3: GET /infygo/flights/sources */
    @GetMapping("/sources")
    public List<String> getSources() {
        return flightService.getSources();
    }

    /** Requirement 4: GET /infygo/flights/destinations */
    @GetMapping("/destinations")
    public List<String> getDestinations() {
        return flightService.getDestinations();
    }

    /**
     * Requirement 5, canonical matrix-parameter form:
     * GET /infygo/flights/search;source=Chennai;destination=Delhi;journeyDate=2026-12-01
     * Optional filters: ;airline=..;departureFrom=HH:mm;departureTo=HH:mm;minPrice=..;maxPrice=..
     */
    @GetMapping(value = {"/{searchKey}", "/{searchKey}/**"})
    public List<FlightResponse> searchWithMatrixParameters(
            @PathVariable("searchKey") String searchKey,
            @MatrixVariable(name = "source") String source,
            @MatrixVariable(name = "destination") String destination,
            @MatrixVariable(name = "journeyDate") String journeyDate,
            @MatrixVariable(name = "airline", required = false) String airline,
            @MatrixVariable(name = "departureFrom", required = false) String departureFrom,
            @MatrixVariable(name = "departureTo", required = false) String departureTo,
            @MatrixVariable(name = "minPrice", required = false) String minPrice,
            @MatrixVariable(name = "maxPrice", required = false) String maxPrice) {
        if (!"search".equals(searchKey)) {
            throw new ResourceNotFoundException("request.search.segment", searchKey);
        }
        return flightService.searchFlights(new FlightSearchRequest(source, destination, journeyDate, airline,
                departureFrom, departureTo, minPrice, maxPrice));
    }

    /**
     * Requirement 5, printed route shape /flights/{source}/{destination}/{journey date}.
     * Optional filters are matrix parameters on the date segment, e.g. .../2026-12-01;airline=Kaveri%20Air
     */
    @GetMapping("/{source:^(?!search$).*}/{destination}/{journeyDate}")
    public List<FlightResponse> searchWithPathSegments(
            @PathVariable("source") String source,
            @PathVariable("destination") String destination,
            @PathVariable("journeyDate") String journeyDate,
            @MatrixVariable(name = "airline", pathVar = "journeyDate", required = false) String airline,
            @MatrixVariable(name = "departureFrom", pathVar = "journeyDate", required = false) String departureFrom,
            @MatrixVariable(name = "departureTo", pathVar = "journeyDate", required = false) String departureTo,
            @MatrixVariable(name = "minPrice", pathVar = "journeyDate", required = false) String minPrice,
            @MatrixVariable(name = "maxPrice", pathVar = "journeyDate", required = false) String maxPrice) {
        return flightService.searchFlights(new FlightSearchRequest(source, destination, journeyDate, airline,
                departureFrom, departureTo, minPrice, maxPrice));
    }
}
