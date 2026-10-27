# API reference

Base URL: `http://localhost:{SERVER_PORT:8080}/InfyGo`. All bodies are JSON. Interactive docs: `/InfyGo/swagger-ui.html`.

## Error format (all endpoints)

```json
{
  "timestamp": "2026-10-26T15:04:05.123+05:30",
  "status": 400,
  "error": "Bad Request",
  "code": "VALIDATION_FAILED",
  "message": "Request validation failed.",
  "path": "/InfyGo/infygo/register",
  "fieldErrors": [ { "field": "password", "message": "Password must contain at least one uppercase letter." } ]
}
```

`fieldErrors` appears only for body validation failures. Rejected values are never echoed back.

| code | HTTP | When |
|---|---|---|
| `VALIDATION_FAILED` | 400 | Bean Validation failed on the body |
| `INVALID_REQUEST` | 400 | Bad date, city, filter or identifier; journey not in the future |
| `MISSING_MATRIX_PARAMETER` | 400 | Required matrix parameter absent |
| `MALFORMED_REQUEST` | 400 | Body missing or not JSON |
| `INVALID_PARAMETER` | 400 | Wrong type, e.g. a non-numeric PNR |
| `PAYMENT_VALIDATION_FAILED` | 400 | Expired card, wrong total bill |
| `INVALID_CREDENTIALS` | 401 | Login failed (same response for unknown user and wrong password) |
| `RESOURCE_NOT_FOUND` / `ROUTE_NOT_FOUND` | 404 | Unknown user, flight, ticket or path |
| `METHOD_NOT_ALLOWED` | 405 | Wrong HTTP method |
| `DUPLICATE_RESOURCE` | 409 | E-mail or user id already registered; ticket already paid |
| `INSUFFICIENT_SEATS` | 409 | Not enough seats left |
| `DATA_CONFLICT` | 409 | Database constraint violation |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Content-Type is not JSON |
| `INTERNAL_ERROR` | 500 | Unexpected error (details only in the server log) |
| `PNR_GENERATION_FAILED` | 503 | No free PNR after the configured attempts; retry |

---

## 1. Register: `POST /infygo/register` → 201

```json
{ "userId": "asha01", "name": "Asha Kumar", "city": "Chennai", "email": "asha@example.com",
  "phone": "+919876543210", "password": "Demo@Pass#2026" }
```

| Field | Rule |
|---|---|
| userId | 3–30 characters `[A-Za-z0-9._-]`, case-insensitive, unique |
| name, city | letters, spaces, `.'-` |
| email | valid address, unique (case-insensitive) |
| phone | 7–15 digits, optional leading `+` |
| password | 9–64 characters with at least one uppercase letter, one lowercase letter and one special character |

Response: `{ "message": "Registration successful", "userId", "name", "city", "email", "phone" }`. No password is returned. Errors: 400, 409.

## 2. Login: `POST /infygo/login` → 200

`{ "userId": "asha01", "password": "Demo@Pass#2026" }` → `{ "message": "Login successful", "userId", "name", "email" }`. Errors: 400, 401.

## 3. Sources: `GET /infygo/flights/sources` → 200

`["Bengaluru", "Chennai", "Delhi", ...]`: distinct values, sorted, read from Flight_Details. Returns `[]` when the table is empty.

## 4. Destinations: `GET /infygo/flights/destinations` → 200

As above, for the destination column.

## 5. Search flights → 200

Canonical (matrix parameters):
```
GET /infygo/flights/search;source=Chennai;destination=Delhi;journeyDate=2026-12-01
GET /infygo/flights/search;source=Chennai;destination=Delhi;journeyDate=2026-12-01;airline=Kaveri%20Air;departureFrom=06:00;departureTo=12:00;minPrice=3000;maxPrice=6000
```
Printed route form (filters as matrix parameters on the date segment):
```
GET /infygo/flights/Chennai/Delhi/2026-12-01;maxPrice=5000
```

| Parameter | Required | Rule |
|---|---|---|
| source, destination | yes | city names, case-insensitive, must differ |
| journeyDate | yes | `yyyy-MM-dd`, strictly after today (Asia/Kolkata) |
| airline | no | exact name, case-insensitive |
| departureFrom / departureTo | no | `HH:mm` (24 h), inclusive, from ≤ to |
| minPrice / maxPrice | no | non-negative numbers, inclusive, min ≤ max |

Response: an array, sorted by departure time and then fare. Only flights with seats left are included:
```json
[{ "flightId": "KA101-261120", "airlines": "Kaveri Air", "source": "Chennai", "destination": "Delhi",
   "flightAvailableDate": "2026-11-20", "departureTime": "06:30", "arrivalTime": "09:20",
   "fare": 4500.00, "seatCount": 60 }]
```
No match → `[]`. Errors: 400.

## 6. Book tickets → 201

```
POST /infygo/book/tickets;flightId=KA101-261120;userId=asha01      (canonical matrix form)
POST /infygo/book/KA101-261120/asha01                              (printed route form)
```
```json
{ "passengers": [
    { "passengerName": "Asha Kumar", "passengerAge": 34, "passengerGender": "Female" },
    { "passengerName": "Ravi Kumar", "passengerAge": 36, "passengerGender": "Male" } ] }
```
Each booking takes 1–10 passengers. Age must be 0–120 and gender `Male`, `Female` or `Other` (case-insensitive). Any seat count or fare in the body is ignored.

Response:
```json
{ "pnr": 4821937, "userId": "asha01", "flightId": "KA101-261120", "airlines": "Kaveri Air",
  "source": "Chennai", "destination": "Delhi", "bookingDate": "2026-10-26", "departureDate": "2026-11-20",
  "departureTime": "06:30", "arrivalTime": "09:20", "noOfSeats": 2, "farePerPassenger": 4500.00,
  "totalFare": 9000.00, "paymentStatus": "PENDING", "passengers": [ { "passengerId": 1, "passengerName": "Asha Kumar", "passengerAge": "34", "passengerGender": "Female" }, ... ] }
```
Errors: 400 (validation, or a flight departing today or earlier), 404 (user or flight), 409 (`INSUFFICIENT_SEATS`), 503.

### Ticket lookup (enhancement): `GET /infygo/tickets/{pnr}` → 200

Same body as above. `paymentStatus` is `PAID` once the mock payment has been made. Errors: 400, 404.

## 7. Mock payment: `POST /infygo/payment` → 201

**Synthetic data only. No real payment is made.**
```json
{ "pnr": 4821937, "cardNumber": "TESTCARD00003456", "cardHolderName": "Asha Kumar", "cvv": "123",
  "apin": "4321", "expiryMonth": "Dec", "expiryYear": "2030", "totalBill": 9000.00 }
```

| Field | Rule |
|---|---|
| pnr | existing, unpaid ticket |
| cardNumber | exactly 16 alphanumeric characters |
| cardHolderName | letters, spaces, `.'-` |
| cvv | exactly 3 digits (never stored) |
| apin | 4–6 digits (never stored) |
| expiryMonth | `Jan`…`Dec` (case-insensitive) |
| expiryYear | 4 digits; month/year not in the past, at most 20 years ahead |
| totalBill | must equal the ticket's `totalFare` |

Response:
```json
{ "message": "Mock payment successful. No real money was charged.", "status": "SUCCESS", "paymentId": 1,
  "pnr": 4821937, "maskedCardNumber": "XXXXXXXXXXXX3456", "amountPaid": 9000.00, "paymentDate": "2026-10-26T15:10:00" }
```
Errors: 400, 404, 409 (already paid).

## Operational

* `GET /InfyGo/actuator/health`: liveness and database health.
* `GET /InfyGo/v3/api-docs`: OpenAPI JSON.
