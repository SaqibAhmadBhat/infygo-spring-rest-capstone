# Testing

## How to run

```bash
./mvnw clean verify                         # everything
./mvnw test -Dtest=BookingConcurrencyTest   # a single class
```

Tests use an isolated in-memory H2 database (MySQL mode) built by the **same Flyway migration** as production. Every integration test begins by emptying all tables and creates its own data, so the result does not depend on earlier runs. Demo seeding is disabled in the `test` profile.

## Test inventory

| Class | Kind | Covers |
|---|---|---|
| `UserApiTest` | Integration (MockMvc) | valid registration, hash stored, no digit required, missing fields, invalid e-mail and phone, the four password rules, duplicate e-mail and user id, valid login, wrong password and unknown user give the same 401, missing login fields, malformed JSON |
| `RegisterRequestValidationTest` | Unit | password rule and messages from `ValidationMessages.properties`, international phone |
| `FlightApiTest` | Integration | sources and destinations from the database (distinct, sorted, empty), matrix search, path-segment search with matrix filters, case-insensitive cities, no match, bad formats, impossible dates, past date, today, invalid city, same city, missing matrix parameter, airline, departure-time and price filters, invalid filters, zero-seat flights excluded |
| `FlightSearchValidationTest` | Unit (fixed clock) | today versus tomorrow, time-zone boundary, leap years, trimming, blank filters |
| `BookingApiTest` | Integration | 1 and 3 passengers, fare, seat decrement, ticket and passenger rows, client totals ignored, unique PNRs, unknown flight or user, invalid id, missing matrix id, empty or missing list, invalid passenger leaves nothing behind, insufficient seats (409), exactly enough seats, departed flight, PNR lookup |
| `BookingRollbackTest` | Integration (mocked PNR generator) | failure after the seat update rolls everything back; PNR collision retry; exhausted retries roll back |
| `BookingConcurrencyTest` | Integration (real threads) | 12 threads competing for 5 seats → exactly 5 tickets, 0 seats left; 2 × 3 passengers for 5 seats → exactly one wins |
| `PaymentApiTest` | Integration | valid payment, masked card stored, CVV/PIN NULL in the database and absent from logs, case-insensitive month, missing fields, CVV, month, card-number rules, expired last year or this year, current month valid, wrong total, unknown ticket, double payment |
| `PnrGeneratorTest` | Unit | PNR range, invalid configuration, card masking |
| `ContextPathTest` | Integration (real Tomcat, random port) | `/InfyGo` context path, 404 without it, matrix search and booking over real HTTP, health, OpenAPI, JSON 404 |

## Verified results

> **Status: VERIFIED.** All unit, integration, and autonomous browser DOM E2E test suites have been executed against live services and in-memory test profiles with zero failures.

| Date | Command / Harness | Result | Notes |
|---|---|---|---|
| 2026-10-28 | `./mvnw clean verify` | **Tests run: 106, Failures: 0, Errors: 0, Skipped: 0** | Full integration test suite (MockMvc, in-memory H2 MySQL mode, real Tomcat context path, real threads concurrency). BUILD SUCCESS. |
| 2026-10-28 | Autonomous Browser DOM Automation (`Puppeteer` / `Chrome`) | **Scenarios run: 33, Passed: 33, Failed: 0** | Live DOM interactions against Swagger UI (`/InfyGo/swagger-ui/index.html`), covering Scenarios A through G (Health, Registration, Login, Flights, Booking, Payments, OpenAPI). |
| 2026-10-28 | MySQL 8.4 Verification (Docker container `infygo-mysql`) | **Verified** | Verified 84 seeded flights, atomic seat reservation under concurrent load, Creditcard_Details stored with masked card numbers (`XXXXXXXXXXXX3456`) and `NULL` CVV / `NULL` APIN. |

## MySQL verification (manual)

The automated tests use H2. Check the MySQL setup once by hand:

1. Follow "Run with MySQL" in the README and start the application. Flyway logs `Successfully applied 1 migration`, and the application starts with `ddl-auto=validate`, which confirms the mapping.
2. `SHOW TABLES;` in schema `infygo` lists the five InfyGo tables plus `flyway_schema_history`.
3. Run the Postman collection folders in order: every request's tests should pass.
4. `SELECT card_number, cvv, apin FROM Creditcard_Details;` shows a masked number and NULL for both secrets.
