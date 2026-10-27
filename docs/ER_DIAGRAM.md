# ER diagram and schema

```mermaid
erDiagram
    User_Details ||--o{ Ticket_Details : books
    Flight_Details ||--o{ Ticket_Details : "is booked on"
    Ticket_Details ||--|{ Passenger_Details : contains
    Ticket_Details ||--o| Creditcard_Details : "paid by (mock)"

    User_Details {
        VARCHAR30 user_id PK
        VARCHAR60 name
        VARCHAR50 city
        VARCHAR100 email UK
        VARCHAR20 phone
        VARCHAR100 password "BCrypt hash"
    }
    Flight_Details {
        VARCHAR20 flight_id PK
        VARCHAR50 airlines
        VARCHAR50 source
        VARCHAR50 destination
        VARCHAR5 departure_time "HH:mm"
        VARCHAR5 arrival_time "HH:mm"
        DATE flight_available_date
        DECIMAL fare "10,2"
        INT seat_count "CHECK >= 0"
    }
    Ticket_Details {
        INT pnr PK
        DATE booking_date
        DATE departure_date
        VARCHAR5 departure_time
        VARCHAR20 flight_id FK
        INT no_of_seats
        DECIMAL total_fare "10,2"
        VARCHAR30 user_id FK
    }
    Passenger_Details {
        INT passenger_id PK "auto"
        VARCHAR60 passenger_name
        VARCHAR3 passenger_age
        VARCHAR10 passenger_gender
        INT ticket_pnr FK
    }
    Creditcard_Details {
        INT payment_id PK "added"
        INT pnr FK "added, unique"
        VARCHAR16 card_number "masked only"
        VARCHAR60 card_holder_name
        VARCHAR3 cvv "always NULL"
        VARCHAR6 apin "always NULL"
        VARCHAR3 expiry_month
        VARCHAR4 expiry_year
        DECIMAL total_bill "10,2"
        DATETIME payment_date "added"
    }
```

DDL: [`src/main/resources/db/migration/V1__create_infygo_schema.sql`](../src/main/resources/db/migration/V1__create_infygo_schema.sql).

## Differences from the supplied diagram (and why)

| Diagram | Implementation | Reason |
|---|---|---|
| `fare`, `total_fare`: Double; `total_bill`: String | `DECIMAL(10,2)` / `BigDecimal` | Exact money arithmetic. The API exposes them as JSON numbers. |
| Creditcard_Details has no key and no link to a ticket | Added `payment_id` (PK), `pnr` (FK, unique) and `payment_date` | A payment must refer to the ticket it pays for, and a masked card number cannot serve as a key. These are the smallest additions that make that possible. |
| `cvv`, `apin` stored | Columns kept, never written (NULL) | Storing card authentication data is unsafe even in a demo |
| `card_number` | Masked value `XXXXXXXXXXXX` + last 4 | Never store a full card number |
| Keys, constraints | PKs, FKs, unique e-mail, CHECK `seat_count >= 0`, index on (source, destination, date) | Integrity and search performance |

Field names, table names and the types of identifiers (`user_id`/`flight_id` String, `pnr`/`passenger_id`/`ticket_pnr` Integer, `passenger_age` String) follow the diagram as supplied. The brief mentions a sixth table that was not listed; see `PROJECT_REQUIREMENTS.md`.
