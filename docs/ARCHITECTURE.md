# Architecture

```mermaid
flowchart LR
    C[Postman / Swagger UI / client] -->|HTTP JSON\n/InfyGo/infygo/...| T[Embedded Tomcat]
    T --> D[DispatcherServlet\nPathPatternParser\n@MatrixVariable binding]
    D --> V[Bean Validation\nValidationMessages.properties]
    V --> CT[Controllers\nUser · Flight · Booking · Payment]
    CT --> S[Services\nUserService · FlightService\nBookingService · PaymentService\nPnrGenerator]
    S --> R[Spring Data JPA repositories\n+ Specifications]
    R --> H[Hibernate 6]
    H --> DB[(MySQL schema infygo\nH2 in tests)]
    F[Flyway V1 migration] --> DB
    CT -. exceptions .-> GE[GlobalExceptionHandler\n@RestControllerAdvice → ApiError]
```

## Layers

| Layer | Responsibility | Rule |
|---|---|---|
| Controller | Routing, matrix/path/body binding, HTTP status | No business logic; delegates to one service call |
| DTO (records) | Request shape and declarative validation; response shape | Entities are never bound from requests or serialised to JSON |
| Service | Business rules, transactions, PNR, payment checks | Constructor injection; `@Transactional` boundaries live here |
| Repository | Queries and the atomic seat update | No business rules |
| Entity | Mapping to the prescribed tables | `Persistable` on client-assigned keys (user id, PNR) forces INSERT, never a silent merge |
| Exception handling | One error format, correct status codes | Never returns stack traces, SQL or rejected values |

## Booking request flow

```mermaid
sequenceDiagram
    participant Client
    participant BookingController
    participant BookingService
    participant DB
    Client->>BookingController: POST /book/tickets;flightId=..;userId=.. {passengers}
    BookingController->>BookingController: @Valid body (each passenger)
    BookingController->>BookingService: bookTickets(...)
    Note over BookingService,DB: one transaction
    BookingService->>DB: SELECT user, flight (404 if missing)
    BookingService->>DB: UPDATE Flight_Details SET seat_count = seat_count - n WHERE flight_id = ? AND seat_count >= n
    alt 0 rows updated
        BookingService-->>Client: 409 INSUFFICIENT_SEATS (nothing changed)
    else 1 row updated
        BookingService->>DB: generate PNR (existence check, retry)
        BookingService->>DB: INSERT Ticket_Details, Passenger_Details
        BookingService-->>Client: 201 ticket (PNR, fare, passengers)
    end
    Note over BookingService,DB: any exception → full rollback, including the seat update
```

## Why a conditional UPDATE instead of read-then-write

Reading `seat_count`, checking it in Java and then writing it back lets two concurrent requests read the same value and oversell the flight. The single `UPDATE ... WHERE seat_count >= n` statement runs atomically in the database. It locks the row, re-checks the condition against the committed value and reports whether it succeeded. No retry loop or explicit lock is needed, and the behaviour is identical on MySQL InnoDB and H2. `BookingConcurrencyTest` exercises it with 12 competing threads.

## Configuration profiles

| Profile | Database | Use |
|---|---|---|
| default | MySQL, from `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | Normal run / assessment |
| `h2` | In-memory H2 (MySQL mode) + `/InfyGo/h2-console` | Zero-install demo |
| `test` | Isolated in-memory H2, seeding disabled | Automated tests |

Flyway applies the same `V1__create_infygo_schema.sql` in every profile. Hibernate runs with `ddl-auto=validate`, so a mapping that drifts from the schema fails at start-up.
