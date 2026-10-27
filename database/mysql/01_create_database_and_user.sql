-- Run once as a MySQL administrator:  mysql -u root -p < database/mysql/01_create_database_and_user.sql
-- Replace the placeholder password before running and use the same value in your DB_PASSWORD variable.
-- Tables are NOT created here: Flyway creates them automatically on application start-up
-- (src/main/resources/db/migration/V1__create_infygo_schema.sql).

CREATE DATABASE IF NOT EXISTS infygo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'infygo_app'@'localhost' IDENTIFIED BY 'change-me-local-only';
GRANT ALL PRIVILEGES ON infygo.* TO 'infygo_app'@'localhost';
FLUSH PRIVILEGES;
