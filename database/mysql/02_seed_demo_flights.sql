-- Optional manual seed (the application also seeds automatically when INFYGO_SEED_DEMO_DATA=true).
-- Entirely fictional airlines and flights, dated relative to today so they never expire.
-- Run after the application has started once (so Flyway has created the tables):
--   mysql -u infygo_app -p infygo < database/mysql/02_seed_demo_flights.sql
USE infygo;

INSERT IGNORE INTO Flight_Details
    (flight_id, airlines, source, destination, departure_time, arrival_time, flight_available_date, fare, seat_count)
VALUES
    ('SQL-KA101', 'Kaveri Air',    'Chennai',   'Delhi',     '06:30', '09:20', DATE_ADD(CURDATE(), INTERVAL 3 DAY),  4500.00, 60),
    ('SQL-IA102', 'Indus Airways', 'Chennai',   'Delhi',     '14:15', '17:05', DATE_ADD(CURDATE(), INTERVAL 3 DAY),  6200.00, 60),
    ('SQL-NJ103', 'Nilgiri Jet',   'Chennai',   'Delhi',     '21:00', '23:45', DATE_ADD(CURDATE(), INTERVAL 3 DAY),  3900.00, 60),
    ('SQL-KA201', 'Kaveri Air',    'Delhi',     'Chennai',   '07:10', '10:00', DATE_ADD(CURDATE(), INTERVAL 7 DAY),  4700.00, 60),
    ('SQL-IA301', 'Indus Airways', 'Mumbai',    'Bengaluru', '09:00', '10:45', DATE_ADD(CURDATE(), INTERVAL 7 DAY),  3500.00, 60),
    ('SQL-NJ401', 'Nilgiri Jet',   'Hyderabad', 'Chennai',   '18:30', '19:50', DATE_ADD(CURDATE(), INTERVAL 14 DAY), 2800.00, 60);
