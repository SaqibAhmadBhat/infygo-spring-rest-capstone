# syntax=docker/dockerfile:1
# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: Build with Maven
# ──────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper and POM first for layer-cache efficiency
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw -B dependency:resolve

# Copy source and build (skip tests – run them in CI, not in the Docker build)
COPY src/ src/
RUN ./mvnw -B package -DskipTests

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: Minimal JRE runtime image
# ──────────────────────────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app

# Non-root user for security
RUN groupadd --system infygo && useradd --system --gid infygo infygo

# Copy the built JAR from Stage 1
COPY --from=build /app/target/*.jar app.jar
RUN chown infygo:infygo app.jar

USER infygo

# Expose the Spring Boot default port
EXPOSE 8080

# Health check using the actuator endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/InfyGo/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

