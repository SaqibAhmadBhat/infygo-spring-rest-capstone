-- InfyGo schema: the prescribed data tables (see docs/ER_DIAGRAM.md).
-- Portable SQL: runs on MySQL 8 and on H2 (MODE=MySQL) used by tests.
-- Money columns are DECIMAL(10,2) instead of the diagram's Double/String to avoid floating-point errors.

CREATE TABLE User_Details (
    user_id   VARCHAR(30)  NOT NULL,
    name      VARCHAR(60)  NOT NULL,
    city      VARCHAR(50)  NOT NULL,
    email     VARCHAR(100) NOT NULL,
    phone     VARCHAR(20)  NOT NULL,
    password  VARCHAR(100) NOT NULL,
    CONSTRAINT pk_user_details PRIMARY KEY (user_id),
    CONSTRAINT uk_user_details_email UNIQUE (email)
);

CREATE TABLE Flight_Details (
    flight_id             VARCHAR(20)   NOT NULL,
    airlines              VARCHAR(50)   NOT NULL,
    source                VARCHAR(50)   NOT NULL,
    destination           VARCHAR(50)   NOT NULL,
    departure_time        VARCHAR(5)    NOT NULL,
    arrival_time          VARCHAR(5)    NOT NULL,
    flight_available_date DATE          NOT NULL,
    fare                  DECIMAL(10,2) NOT NULL,
    seat_count            INT           NOT NULL,
    CONSTRAINT pk_flight_details PRIMARY KEY (flight_id),
    CONSTRAINT ck_flight_seat_count CHECK (seat_count >= 0),
    CONSTRAINT ck_flight_fare CHECK (fare > 0)
);

CREATE INDEX idx_flight_route_date ON Flight_Details (source, destination, flight_available_date);

CREATE TABLE Ticket_Details (
    pnr            INT           NOT NULL,
    booking_date   DATE          NOT NULL,
    departure_date DATE          NOT NULL,
    departure_time VARCHAR(5)    NOT NULL,
    flight_id      VARCHAR(20)   NOT NULL,
    no_of_seats    INT           NOT NULL,
    total_fare     DECIMAL(10,2) NOT NULL,
    user_id        VARCHAR(30)   NOT NULL,
    CONSTRAINT pk_ticket_details PRIMARY KEY (pnr),
    CONSTRAINT fk_ticket_flight FOREIGN KEY (flight_id) REFERENCES Flight_Details (flight_id),
    CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES User_Details (user_id),
    CONSTRAINT ck_ticket_seats CHECK (no_of_seats > 0)
);

CREATE TABLE Passenger_Details (
    passenger_id     INT         NOT NULL AUTO_INCREMENT,
    passenger_name   VARCHAR(60) NOT NULL,
    passenger_age    VARCHAR(3)  NOT NULL,
    passenger_gender VARCHAR(10) NOT NULL,
    ticket_pnr       INT         NOT NULL,
    CONSTRAINT pk_passenger_details PRIMARY KEY (passenger_id),
    CONSTRAINT fk_passenger_ticket FOREIGN KEY (ticket_pnr) REFERENCES Ticket_Details (pnr)
);

-- Mock payment table. Additions to the diagram: payment_id (surrogate key), pnr (link to the paid ticket,
-- unique = one payment per ticket) and payment_date. cvv and apin are kept only for schema compatibility
-- and are never written by the application (always NULL). card_number holds a MASKED value only.
CREATE TABLE Creditcard_Details (
    payment_id       INT           NOT NULL AUTO_INCREMENT,
    pnr              INT           NOT NULL,
    card_number      VARCHAR(16)   NOT NULL,
    card_holder_name VARCHAR(60)   NOT NULL,
    cvv              VARCHAR(3)    NULL,
    apin             VARCHAR(6)    NULL,
    expiry_month     VARCHAR(3)    NOT NULL,
    expiry_year      VARCHAR(4)    NOT NULL,
    total_bill       DECIMAL(10,2) NOT NULL,
    payment_date     DATETIME      NOT NULL,
    CONSTRAINT pk_creditcard_details PRIMARY KEY (payment_id),
    CONSTRAINT uk_creditcard_pnr UNIQUE (pnr),
    CONSTRAINT fk_creditcard_ticket FOREIGN KEY (pnr) REFERENCES Ticket_Details (pnr)
);
