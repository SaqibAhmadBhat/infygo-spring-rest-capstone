package com.infygo.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

/**
 * Runs against a real embedded Tomcat to prove the /InfyGo context path and matrix parameters work over HTTP,
 * not only inside MockMvc.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ContextPathTest extends AbstractIntegrationTest {

    @LocalServerPort
    private int port;

    private final HttpClient http = HttpClient.newHttpClient();

    private HttpResponse<String> get(String path) throws Exception {
        return http.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).GET().build(),
                HttpResponse.BodyHandlers.ofString());
    }

    @Test
    void endpointsAreServedUnderTheInfyGoContextPath() throws Exception {
        saveFlight("KA101", "Kaveri Air", "Chennai", "Delhi", "06:30", today().plusDays(5), "4500.00", 10);

        assertThat(get("/InfyGo/infygo/flights/sources").statusCode()).isEqualTo(200);
        assertThat(get("/InfyGo/infygo/flights/destinations").body()).contains("Delhi");
        assertThat(get("/infygo/flights/sources").statusCode()).isEqualTo(404);
    }

    @Test
    void matrixSearchWorksOverRealHttp() throws Exception {
        saveFlight("KA101", "Kaveri Air", "Chennai", "Delhi", "06:30", today().plusDays(5), "4500.00", 10);

        HttpResponse<String> response = get("/InfyGo/infygo/flights/search;source=Chennai;destination=Delhi;journeyDate="
                + today().plusDays(5) + ";airline=Kaveri%20Air;maxPrice=5000");
        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.body()).contains("KA101");
    }

    @Test
    void matrixBookingWorksOverRealHttp() throws Exception {
        saveUser("asha01", "asha@example.com");
        saveFlight("KA101", "Kaveri Air", "Chennai", "Delhi", "06:30", today().plusDays(5), "4500.00", 10);

        HttpRequest request = HttpRequest.newBuilder(URI.create(
                        "http://localhost:" + port + "/InfyGo/infygo/book/tickets;flightId=KA101;userId=asha01"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json(BookingApiTest.passengers(2))))
                .build();
        HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());

        assertThat(response.statusCode()).isEqualTo(201);
        assertThat(seatsOf("KA101")).isEqualTo(8);
    }

    @Test
    void healthAndOpenApiDocsAreAvailable() throws Exception {
        assertThat(get("/InfyGo/actuator/health").statusCode()).isEqualTo(200);
        HttpResponse<String> docs = get("/InfyGo/v3/api-docs");
        assertThat(docs.statusCode()).isEqualTo(200);
        assertThat(docs.body()).contains("/infygo/register");
    }

    @Test
    void errorsUseTheJsonErrorFormat() throws Exception {
        HttpResponse<String> response = get("/InfyGo/infygo/does-not-exist");
        assertThat(response.statusCode()).isEqualTo(404);
        assertThat(response.body()).contains("\"code\"").doesNotContain("Exception");
    }
}
