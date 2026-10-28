# Spring REST Transport & Logistic Domain Capstone - InfyGo

[![CI](https://github.com/SaqibAhmadBhat/infygo-spring-rest-capstone/actions/workflows/ci.yml/badge.svg)](https://github.com/SaqibAhmadBhat/infygo-spring-rest-capstone/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/SaqibAhmadBhat/infygo-spring-rest-capstone/actions/workflows/pages.yml/badge.svg)](https://saqibahmadbhat.github.io/infygo-spring-rest-capstone/)
[![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)](https://openjdk.org/projects/jdk/17/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![License: Academic](https://img.shields.io/badge/License-Academic-blue)](LICENSE)

> **🎓 Academic project** — Infosys Springboard · Naan Mudhalvan Capstone  
> This is **not** a commercial airline-booking service. The payment flow is a mock implementation.

---

## 🌐 Presentation

**[▶ View the animated project presentation](https://saqibahmadbhat.github.io/infygo-spring-rest-capstone/)**

---

## 📋 Project Overview

InfyGo is a Spring Boot REST API capstone for the **Transport & Logistic Domain**, implementing a complete flight search and booking workflow. The API supports:

- User registration and login with BCrypt password hashing
- Flight search via **matrix parameters** (`/flights/search;source=X;destination=Y;journeyDate=Z`)
- Seat booking, passenger capture, mock payment processing
- PNR-based ticket retrieval
- Full JSR-380 input validation with descriptive error messages
- Swagger / OpenAPI documentation

**Application base URL:** `http://localhost:8080/InfyGo`  
**Swagger UI:** `http://localhost:8080/InfyGo/swagger-ui/index.html`

---

## ✨ Features

| # | Feature | Endpoint |
|---|---------|----------|
| 1 | User registration (BCrypt, validated) | `POST /infygo/register` |
| 2 | User login (password never returned) | `POST /infygo/login` |
| 3 | List source cities | `GET /infygo/flights/sources` |
| 4 | List destination cities | `GET /infygo/flights/destinations` |
| 5 | Flight search with matrix parameters | `GET /infygo/flights/search;source=…;destination=…;journeyDate=…` |
| 6 | Book seats (matrix parameters) | `POST /infygo/book/tickets;flightId=…;userId=…` |
| 7 | Process mock payment | `POST /infygo/payment` |
| 8 | Retrieve ticket by PNR | `GET /infygo/tickets/{pnr}` |
| 9 | Health check | `GET /InfyGo/actuator/health` |

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Language | Java 17 |
| Framework | Spring Boot 3.5.6 |
| ORM | Spring Data JPA + Hibernate 6.6 |
| DB Migration | Flyway |
| Production DB | MySQL 8.4 (Docker) |
| Test DB | H2 (in-memory) |
| Security | BCrypt password hashing |
| Docs | Springdoc OpenAPI (Swagger UI) |
| Testing | JUnit 5, Spring Boot Test |
| Build | Maven (Maven Wrapper `./mvnw`) |
| Container | Docker Compose |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     HTTP Client                          │
│          (Browser / Postman / Integration Tests)         │
└────────────────────────┬────────────────────────────────┘
                         │ REST (JSON + Matrix Params)
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Spring Boot — context path /InfyGo            │
│                                                          │
│  UserController   FlightController   BookingController   │
│  PaymentController            TicketController           │
└────────────────────────┬────────────────────────────────┘
                         │ Spring Data JPA
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Hibernate 6.6 / JPA                    │
└────────────────┬────────────────────┬───────────────────┘
                 │                    │
       (production)             (tests / CI)
         MySQL 8.4                   H2
       Docker Compose          (in-memory, auto)
```

**Flyway** manages schema migrations. The single migration `V1__init.sql` creates
all five tables and seeds 84 fictional demo flights.

---

## 🗃️ Database Design

Five tables (schema defined in `src/main/resources/db/migration/V1__init.sql`):

| Table | Description |
|-------|-------------|
| `User_Details` | Registered users (password hashed with BCrypt) |
| `Flight_Details` | Flight inventory with source, destination, fare, seat count |
| `Ticket_Details` | Bookings — PNR, flight, user, journey date, status |
| `Passenger_Details` | Passengers per ticket (name, age, gender) |
| `Creditcard_Details` | Mock payment record (card number masked, CVV/PIN never stored) |

> **Security:** Card numbers are stored as masked strings (`XXXXXXXXXXXX1234`).  
> CVV and APIN are **never** persisted.

---

## 🚀 Local Setup

### Option A — H2 (no database required)

```bash
git clone https://github.com/SaqibAhmadBhat/infygo-spring-rest-capstone.git
cd infygo-spring-rest-capstone

# Run the full test suite (uses H2 automatically)
./mvnw clean verify
```

Expected output: `BUILD SUCCESS · Tests run: 106, Failures: 0, Errors: 0`

### Option B — MySQL with Docker Compose

#### Prerequisites
- Docker Desktop running
- Java 17 installed

```bash
# 1. Set up environment variables
cp .env.example .env
# Edit .env with your preferred database credentials

# 2. Start MySQL
docker compose up -d

# 3. Start the application
./mvnw spring-boot:run

# 4. Verify
curl http://localhost:8080/InfyGo/actuator/health
# → {"status":"UP"}
```

---

## 🧪 Testing

```bash
# Full test suite (H2, no external dependencies)
./mvnw clean verify

# Targeted test class
./mvnw test -Dtest=FlightApiTest

# With verbose output
./mvnw test -Dtest=FlightApiTest -Dsurefire.useFile=false
```

**Verified results (CI run 2026-10-28):**

```
Tests run: 106, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

---

## 🔑 Key API Examples

### Flight Search (matrix parameters)

```
GET http://localhost:8080/InfyGo/infygo/flights/search;source=Chennai;destination=Delhi;journeyDate=2026-12-01
```

### Book Seats (matrix parameters)

```
POST http://localhost:8080/InfyGo/infygo/book/tickets;flightId=1;userId=5
Content-Type: application/json

{
  "noOfPassengers": 2,
  "passengers": [
    {"name": "Alice Smith", "age": 30, "gender": "Female"},
    {"name": "Bob Smith",   "age": 32, "gender": "Male"}
  ]
}
```

### Register User

```
POST http://localhost:8080/InfyGo/infygo/register
Content-Type: application/json

{
  "userId": "user001",
  "name": "Alice Smith",
  "mobile": "9876543210",
  "email": "alice@example.com",
  "password": "Secure@123"
}
```

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | JDBC URL for MySQL |
| `SPRING_DATASOURCE_USERNAME` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | DB password |

See `.env.example` for all required variables. **Never commit `.env` to Git.**

---

## 🐳 Docker

Build and run the backend as a container:

```bash
# Build the image (multi-stage: Maven build + JRE runtime)
docker build -t infygo-api:latest .

# Run with environment variables
docker run -d \
  --name infygo-api \
  --env-file .env \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/infygo" \
  -p 8080:8080 \
  infygo-api:latest
```

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for full deployment guidance including cloud options.

---

## 📁 Project Structure

```
infygo-spring-rest-capstone/
├── src/
│   ├── main/java/com/infygo/
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Spring Data JPA repositories
│   │   ├── model/               # JPA entities
│   │   ├── dto/                 # Request/response DTOs
│   │   ├── config/              # Spring & OpenAPI configuration
│   │   └── exception/           # Global exception handling
│   ├── main/resources/
│   │   ├── application.properties
│   │   └── db/migration/V1__init.sql   # Flyway migration
│   └── test/                    # JUnit integration tests
├── presentation/                # React + Vite presentation website
├── docs/                        # Architecture, API, ER, Testing, Deployment docs
├── postman/                     # Postman collection
├── database/                    # SQL scripts
├── docker-compose.yml           # MySQL local setup
├── Dockerfile                   # Multi-stage Docker build
├── .env.example                 # Environment template
└── .github/workflows/
    ├── ci.yml                   # Java CI (Maven tests)
    └── pages.yml                # GitHub Pages deployment
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) | Full API reference |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture |
| [`docs/ER_DIAGRAM.md`](docs/ER_DIAGRAM.md) | Entity-relationship diagram |
| [`docs/TESTING.md`](docs/TESTING.md) | Test strategy and results |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deployment guide |
| [`docs/PROJECT_REQUIREMENTS.md`](docs/PROJECT_REQUIREMENTS.md) | Original requirements |

---

## 👥 Project Team

**Infosys Springboard · Naan Mudhalvan Capstone**

| # | Student ID | Name | Role |
|---|-----------|------|------|
| 1 | 950823104052 | **Saqib Ahmad Bhat** | Team Lead / Developer |
| 2 | 950823104064 | Vijaya Kumar | Developer |
| 3 | 950823104065 | Vinayagam S | Developer |
| 4 | 950823104021 | Kannan P | Developer |
| 5 | 950823104005 | Alagesh Pandi P | Developer |
| 6 | 950823104007 | Aqib Majeed | Developer |

---

## ⚠️ Security Notes

- Passwords are hashed with BCrypt and **never returned** in API responses
- Credit card CVV and APIN are **never stored** — mock payment only
- Card numbers are **masked** (`XXXXXXXXXXXX1234`) in storage
- Keep `.env` out of version control at all times
- Rotate any credentials that have been exposed in logs or terminal output

---

*© 2026 InfyGo Team — Infosys Springboard / Naan Mudhalvan Academic Project. All rights reserved.*
