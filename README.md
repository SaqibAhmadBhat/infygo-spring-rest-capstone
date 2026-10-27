# InfyGo – Spring REST Flight Booking (Capstone)

Infosys Springboard · Naan Mudhalvan / TNSkills · Semester 7 capstone.

InfyGo is a flight ticket booking application. It was originally written with Spring MVC and is re-implemented here as a **Spring Boot REST API**. It covers registration, login, source and destination lookup, flight search with filters, multi-passenger booking with PNR generation and a **mock** payment.

| Item | Value |
|---|---|
| Context path | `/InfyGo` (mandatory) |
| Base URL (default port) | `http://localhost:8080/InfyGo/infygo/...` |
| Database schema | `infygo` (MySQL 8; H2 for tests and a zero-install demo) |
| Swagger UI | `http://localhost:8080/InfyGo/swagger-ui.html` |
| Health | `http://localhost:8080/InfyGo/actuator/health` |

## Technology and version choices

| Component | Version | Why |
|---|---|---|
| Java | 17 (LTS) | The PS sets a minimum of Java 8. Spring Boot 3 needs Java 17 or later. |
| Spring Boot | 3.5.6 | Jakarta EE 10 APIs (`jakarta.validation`, `jakarta.persistence`); only Jakarta APIs are used, never `javax`. |
| Spring Data JPA / Hibernate | 6.x (managed by Boot) | Persistence layer required by the PS |
| Flyway | managed by Boot | Repeatable, versioned schema creation (no `ddl-auto=update`) |
| MySQL | 8.x | PS database; H2 2.x in MySQL mode for tests |
| springdoc-openapi | 2.8.9 | Swagger UI / OpenAPI |
| Maven | 3.9.9 via the included Maven Wrapper (`./mvnw`) | No separate Maven install needed |

Spring Boot 3.5 was chosen as a stable line whose APIs are well established. Check the open-source support status at spring.io before submission. Moving to Spring Boot 4 would require changes (for example Jackson 3 and modular test starters), so it is left as future work.

## Quick start (no database install: H2 profile)

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

Fictional demo flights are seeded automatically for today + 3, 7, 14 and 30 days. Open Swagger UI or import `postman/InfyGo.postman_collection.json`.

## Run with MySQL

1. Create the schema and an application user (edit the placeholder password first):
   ```bash
   mysql -u root -p < database/mysql/01_create_database_and_user.sql
   ```
   Alternatively, run `cp .env.example .env`, edit it, then `docker compose up -d`.
2. Export the connection settings (never commit real values):
   ```bash
   export DB_URL='jdbc:mysql://localhost:3306/infygo?serverTimezone=Asia/Kolkata&characterEncoding=UTF-8'
   export DB_USERNAME=infygo_app
   export DB_PASSWORD='your-local-password'
   export SERVER_PORT=8080          # optional
   ```
3. Start the application. Flyway creates the tables (`src/main/resources/db/migration`) and Hibernate validates the mapping:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Optional: add the manual SQL seed with `mysql -u infygo_app -p infygo < database/mysql/02_seed_demo_flights.sql`.

## Tests

```bash
./mvnw clean verify          # build and run all unit and integration tests (H2, no MySQL needed)
```

Reports are written to `target/surefire-reports`. See [docs/TESTING.md](docs/TESTING.md) for the test inventory and the results that have been verified.

## Main workflow (curl)

```bash
B=http://localhost:8080/InfyGo/infygo
D=$(date -v+3d +%F 2>/dev/null || date -d '+3 day' +%F)    # macOS || Linux

curl -s -X POST $B/register -H 'Content-Type: application/json' -d '{"userId":"asha01","name":"Asha Kumar","city":"Chennai","email":"asha@example.com","phone":"+919876543210","password":"Demo@Pass#2026"}'
curl -s -X POST $B/login    -H 'Content-Type: application/json' -d '{"userId":"asha01","password":"Demo@Pass#2026"}'
curl -s "$B/flights/sources"
curl -s "$B/flights/search;source=Chennai;destination=Delhi;journeyDate=$D"
curl -s "$B/flights/search;source=Chennai;destination=Delhi;journeyDate=$D;airline=Kaveri%20Air;maxPrice=5000"
# use a flightId from the search result:
curl -s -X POST "$B/book/tickets;flightId=<flightId>;userId=asha01" -H 'Content-Type: application/json' -d '{"passengers":[{"passengerName":"Asha Kumar","passengerAge":34,"passengerGender":"Female"}]}'
# use the pnr and totalFare from the booking response (synthetic card data only):
curl -s -X POST $B/payment -H 'Content-Type: application/json' -d '{"pnr":<pnr>,"cardNumber":"TESTCARD00003456","cardHolderName":"Asha Kumar","cvv":"123","apin":"4321","expiryMonth":"Dec","expiryYear":"2030","totalBill":<totalFare>}'
```

All names, e-mail addresses, passwords and card values above are fictional test data.

## Matrix parameters

The PS asks for matrix parameters on the search and booking routes, but its printed routes use path placeholders. Both forms are implemented and tested:

| Requirement | Canonical matrix form | Printed route form |
|---|---|---|
| Search | `GET /infygo/flights/search;source=Chennai;destination=Delhi;journeyDate=2026-12-01[;airline=..;departureFrom=HH:mm;departureTo=HH:mm;minPrice=..;maxPrice=..]` | `GET /infygo/flights/Chennai/Delhi/2026-12-01[;airline=..;...]` |
| Booking | `POST /infygo/book/tickets;flightId=KA101-261120;userId=asha01` | `POST /infygo/book/KA101-261120/asha01` |

Spring MVC binds them with `@MatrixVariable`. Spring Boot 3 matches paths with `PathPatternParser`, which keeps the `;name=value` content, so no `removeSemicolonContent` configuration is needed. `ContextPathTest` confirms this over a real Tomcat connection as well as through MockMvc.

## Security scope (please read)

* Passwords are stored as **BCrypt** hashes. Responses never include hashes, and login failures do not reveal whether an account exists.
* Login **verifies credentials only**, which is what the PS requires. No session or token is issued, so the other endpoints are not access-controlled. Issuing a token that the API never checked would be misleading. Adding Spring Security with JWT or a session is listed as future work.
* **Payment is a mock.** No bank or gateway is contacted. CVV and PIN are validated and then discarded, and are never stored or logged. Only a masked card number (`XXXXXXXXXXXX3456`), the holder name, expiry and amount are stored. The diagram's `cvv` and `apin` columns stay in place for compatibility and are always NULL. A real system would use a PCI-DSS-compliant gateway and tokenisation, and would never let card data touch its own servers.
* Database credentials come only from environment variables. `.env` is git-ignored.

## Project structure

```
src/main/java/com/infygo
├── config/        Clock, BCrypt, OpenAPI, typed application properties
├── controller/    REST controllers (no business logic)
├── dto/           Request/response records with Bean Validation
├── entity/        JPA entities for the prescribed tables
├── exception/     Business exceptions + @RestControllerAdvice
├── repository/    Spring Data repositories (atomic seat update)
└── service/       Business rules, PNR generation, booking transaction, mock payment, demo seeding
src/main/resources
├── application.properties, application-h2.properties
├── ValidationMessages.properties
└── db/migration/V1__create_infygo_schema.sql
docs/  postman/  database/  .github/workflows/
```

## Documentation

* [Requirement traceability](docs/PROJECT_REQUIREMENTS.md)
* [Architecture](docs/ARCHITECTURE.md)
* [ER diagram and schema](docs/ER_DIAGRAM.md)
* [API reference](docs/API_DOCUMENTATION.md)
* [Testing](docs/TESTING.md)

## GitHub

Suggested repository name: `infygo-spring-rest-capstone`.
Suggested description: *Professional Infosys Springboard and Naan Mudhalvan Semester 7 capstone implementing the InfyGo flight booking REST API using Spring Boot, Spring Data JPA, MySQL, BCrypt password hashing, transactional booking, PNR generation, validation, mock payments, automated testing and API documentation.*

```bash
git init && git add . && git status     # check that no .env or target/ is staged
git commit -m "InfyGo Spring REST capstone: core API, tests and documentation"
```
