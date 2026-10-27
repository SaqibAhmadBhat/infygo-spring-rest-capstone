# Requirement traceability

Legend: **PS** = stated in the problem statement · **Assumption** = PS silent or ambiguous; interpretation documented · **Enhancement** = beyond the PS.

## Source material

The project folder held no problem-statement files, starter code or database screenshots. The schema below therefore follows the table and field list given in the implementation brief. The brief says the diagram has **six** tables but lists only five (User_Details, Flight_Details, Ticket_Details, Passenger_Details, Creditcard_Details). **No sixth table was invented.** If the original diagram shows one, add it in a new Flyway migration (`V2__...sql`).

## Mandatory configuration

| Requirement | Status | Where |
|---|---|---|
| Schema `infygo` | PS | `application.properties` (`DB_URL`), `database/mysql/01_create_database_and_user.sql` |
| Context path `/InfyGo` | PS | `server.servlet.context-path`; `ContextPathTest` |
| Configurable port | PS | `server.port=${SERVER_PORT:8080}` |
| Maven, Spring Boot REST, Spring Data JPA/Hibernate | PS | `pom.xml` |
| `ValidationMessages.properties` | PS | `src/main/resources/ValidationMessages.properties`, also the `MessageSource` for business errors |
| Central exception handler | PS | `exception/GlobalExceptionHandler` (`@RestControllerAdvice`) |

## Functional requirements

| # | Requirement | Type | Implementation | Tests |
|---|---|---|---|---|
| 1 | `POST /infygo/register`, mandatory fields, validation, save | PS | `UserController.register`, `RegisterRequest`, `UserService.register` | `UserApiTest`, `RegisterRequestValidationTest` |
| 1a | Password: at least 9 characters, 1 uppercase, 1 lowercase, 1 special character (no digit required) | PS | `@Size` + three `@Pattern` on `RegisterRequest.password` | `weakPasswordsAreRejected`, `passwordWithoutDigitIsAccepted` |
| 1b | Duplicate e-mail / user id rejected (409) | PS | `UserService` + unique key `uk_user_details_email` | `duplicateEmailIsRejected`, `duplicateUserIdIsRejected` |
| 1c | BCrypt password hash | Enhancement (brief) | `AppConfig.passwordEncoder` | `validRegistrationIsSavedWithHashedPassword` |
| 1d | User id and e-mail are case-insensitive (stored in lower case) | Assumption | `UserService.normaliseUserId` | `duplicateUserIdIsRejected` |
| 2 | `POST /infygo/login`, check credentials against the database | PS | `UserService.login` | `UserApiTest` login tests |
| 2a | Same 401 for unknown user and wrong password; similar response time | Enhancement | dummy-hash comparison | `wrongPasswordAndUnknownUserGiveTheSameResponse` |
| 3 | `GET /infygo/flights/sources`, distinct, sorted, from the database | PS | `FlightDetailsRepository.findDistinctSources` | `sourcesComeFromTheDatabaseDistinctAndSorted`, `emptyFlightTableGivesEmptyLists` |
| 4 | `GET /infygo/flights/destinations` | PS | `findDistinctDestinations` | same as above |
| 5 | Search by source, destination, future date, using **matrix parameters** | PS | `FlightController` (both route forms), `FlightService`, `FlightSpecifications` | `FlightApiTest`, `FlightSearchValidationTest`, `ContextPathTest` |
| 5a | Date format `yyyy-MM-dd` (strict) | Assumption (ISO) | `ResolverStyle.STRICT` | `badJourneyDateFormatIsRejected`, `impossibleCalendarDatesAreRejected` |
| 5b | Past dates **and today** rejected; "today" judged in `infygo.time-zone` | PS + Assumption | `FlightService.parseJourneyDate` | `pastJourneyDateIsRejected`, `todayIsNotAFutureJourneyDate`, `todayIsJudgedInTheConfiguredTimeZone` |
| 5c | Filters: airline, departure-time window, min/max price (applied in the database query) | PS | JPA `Specification` | `airlineFilterIsCaseInsensitive`, `departureTimeFilters`, `priceFilters`, `invalidFiltersAreRejected` |
| 5d | Only flights with `seat_count > 0` are listed; results sorted by departure time, then fare | Assumption | `FlightSpecifications` | `matrixSearchReturnsMatchingAvailableFlightsSortedByDeparture` |
| 5e | No match returns `200 []` (not 404) | Assumption | — | `noMatchingFlightGivesEmptyList` |
| 6 | `POST /infygo/book/{FlightId}/{UserId}` using matrix parameters, passengers as JSON body | PS | `BookingController` (both forms) | `BookingApiTest`, `ContextPathTest` |
| 6a | User and flight must exist (404) | PS | `BookingService` | `unknownFlightIsNotFound`, `unknownUserIsNotFound` |
| 6b | Every passenger validated; empty list rejected; no partial ticket | PS | `BookingRequest`, `PassengerRequest` | `emptyPassengerListIsRejected`, `invalidPassengerCreatesNoPartialTicket` |
| 6c | Seat count taken from the validated list, never from the client | PS | `request.passengers().size()` | `clientSuppliedSeatCountAndFareAreIgnored` |
| 6d | Seat availability checked and `seat_count` reduced **atomically** | PS | `FlightDetailsRepository.reserveSeats` (conditional `UPDATE`) | `insufficientSeatsIsAConflictAndChangesNothing`, `exactlyTheRemainingSeatsCanBeBooked`, `BookingConcurrencyTest` |
| 6e | Total fare = fare × passengers (`BigDecimal`) | PS | `BookingService` | `multiPassengerBookingPersistsTicketAndPassengers` |
| 6f | PNR generated and unique (7-digit integer; collisions retried; primary key) | PS + Assumption (format) | `PnrGenerator`, `BookingService.generateUniquePnr` | `eachBookingGetsADifferentPnr`, `pnrCollisionIsRetriedWithANewCandidate`, `PnrGeneratorTest` |
| 6g | Whole booking is one transaction (all or nothing) | PS (brief) | `@Transactional bookTickets` | `BookingRollbackTest` |
| 6h | Flights departing today or earlier cannot be booked | Assumption | `BookingService` | `flightDepartingTodayCannotBeBooked` |
| 6i | Maximum 10 passengers per booking | Assumption (safety limit) | `BookingRequest` | — |
| 6j | `GET /infygo/tickets/{pnr}` | Enhancement | `BookingController.getTicket` | `ticketCanBeLookedUpByPnr` |
| 7 | `POST /infygo/payment`, validate card details, insert a payment row | PS | `PaymentController`, `PaymentRequest`, `PaymentService` | `PaymentApiTest` |
| 7a | CVV exactly 3 digits | PS | `@Pattern` | `cvvMustBeExactlyThreeDigits` |
| 7b | Expiry month as first three letters (case-insensitive) | PS | `@Pattern`, normalised to `Jan`..`Dec` | `monthMustBeAThreeLetterMonth`, `monthIsCaseInsensitive` |
| 7c | Expired cards rejected; a card is valid until the end of its expiry month | PS + Assumption | `YearMonth` comparison | `cardExpiredLastYearIsRejected`, `cardExpiredEarlierThisYearIsRejected`, `cardExpiringThisMonthIsStillValid` |
| 7d | Card number: exactly 16 alphanumeric characters | PS ("16 digit alpha numeric") | `^[A-Za-z0-9]{16}$` | `cardNumberMustBe16Alphanumerics` |
| 7e | Total bill must equal the ticket's total fare | Brief | `PaymentService` | `totalBillMustMatchTheTicket` |
| 7f | Ticket must exist; one payment per ticket | Brief | FK + unique `uk_creditcard_pnr` | `unknownTicketIsNotFound`, `ticketCannotBePaidTwice` |
| 7g | CVV/PIN never stored or logged; card number masked | Enhancement (security) | `PaymentService`, `PaymentRequest.toString` | `validSyntheticPaymentIsRecordedMasked` |
| 7h | ATM PIN (`apin`) required, 4–6 digits | Assumption | `@Pattern` | `missingFieldsAreRejected` |
| 8 | Consistent JSON errors with suitable status codes | PS | `GlobalExceptionHandler`, `ApiError` | across all API tests, `errorsUseTheJsonErrorFormat` |

## Known gaps / items to confirm with the faculty guide

1. The official PNR format. A 7-digit random integer is used, configurable through `infygo.pnr.*`. It is **not** claimed to be the official format.
2. Whether "expiry year must be a future year" excludes the current year outright. This build accepts the current year when the expiry month has not yet passed.
3. The sixth table mentioned in the brief (see "Source material").
4. Login issues no token, so the other endpoints are not access-controlled (see README, "Security scope").
