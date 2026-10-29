# Deployment Guide — InfyGo Spring REST Capstone

> **Academic project notice:** InfyGo is an Infosys Springboard / Naan Mudhalvan capstone.
> It is **not** a commercial airline-booking service.
> The payment flow is a mock; no real card data is ever processed.

---

## Contents

1. [Local development (H2 — no Docker required)](#1-local-development-h2)
2. [Local development with MySQL (Docker Compose)](#2-local-development-mysql-docker)
3. [Environment variables reference](#3-environment-variables)
4. [Building and running the Docker image](#4-docker-image)
5. [Production deployment guidance](#5-production-deployment)
6. [GitHub Pages presentation](#6-github-pages-presentation)

---

## 1. Local Development — H2 (Zero-Install Demo)

Run tests or start the app with the embedded H2 in-memory database.
No external database or Docker setup is required.

### Run Automated Tests (Isolated Test Profile)

The test suite runs against an isolated, non-persistent test database (`application-test.properties`) with sample seed data disabled:

```bash
# Run all automated tests (uses H2 test profile automatically)
./mvnw clean verify
```

### Run Application in Demo Mode (H2 Runtime Profile)

To launch the running application with an in-memory H2 database seeded with demo flight data:

```bash
# Start the app with the H2 demo runtime profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

Once started, verify the running application:
- **Actuator Health:** [`http://localhost:8080/InfyGo/actuator/health`](http://localhost:8080/InfyGo/actuator/health) (returns `{"status":"UP"}`)
- **Swagger UI:** [`http://localhost:8080/InfyGo/swagger-ui/index.html`](http://localhost:8080/InfyGo/swagger-ui/index.html)
- **H2 Console:** [`http://localhost:8080/InfyGo/h2-console`](http://localhost:8080/InfyGo/h2-console)
  *JDBC URL:* `jdbc:h2:mem:infygo` | *User Name:* `sa` | *Password:* *(empty)*

> [!NOTE]
> The `test` profile (`application-test.properties`) is reserved strictly for automated testing (`./mvnw verify`).
> For local interactive evaluation, always use the `h2` profile (`application-h2.properties`).
> Neither in-memory profile is intended for production deployment.

---

## 2. Local Development — MySQL (Docker Compose)

### Prerequisites
- Docker Desktop installed and running
- A `.env` file in the project root (copy from `.env.example`)

### Steps

```bash
# 1. Copy and populate the environment file
cp .env.example .env
# Edit .env and set MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD, etc.

# 2. Start the MySQL container
docker compose up -d

# Wait for MySQL to be healthy:
docker compose ps   # State should show "healthy"

# 3. Start the Spring Boot application
./mvnw spring-boot:run

# 4. Verify the application
curl http://localhost:8080/InfyGo/actuator/health
# Expected: {"status":"UP"}
```

### Stopping

```bash
# Stop the app: Ctrl+C in the terminal running mvnw

# Stop the MySQL container (data is preserved in the Docker volume)
docker compose stop

# Remove containers (volume is preserved)
docker compose down

# Remove containers AND volume (deletes all data — destructive!)
docker compose down -v   # ⚠ Only if you want a fresh database
```

---

## 3. Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SPRING_DATASOURCE_URL` | *(set in .env)* | JDBC URL for MySQL |
| `SPRING_DATASOURCE_USERNAME` | *(set in .env)* | Database username |
| `SPRING_DATASOURCE_PASSWORD` | *(set in .env)* | Database password |
| `MYSQL_ROOT_PASSWORD` | *(set in .env)* | MySQL root password (Docker) |
| `MYSQL_DATABASE` | `infygo` | Database name |
| `MYSQL_USER` | *(set in .env)* | MySQL application user |
| `MYSQL_PASSWORD` | *(set in .env)* | MySQL application password |

> [!CAUTION]
> Never commit `.env` to Git. It is already listed in `.gitignore`.
> If credentials are ever accidentally exposed in a Git commit or terminal log,
> rotate them immediately.

---

## 4. Docker Image

### Build

```bash
# From the project root
docker build -t infygo-api:latest .
```

The Dockerfile uses a **multi-stage build**:
- **Stage 1** (`eclipse-temurin:17-jdk-jammy`): Maven build
- **Stage 2** (`eclipse-temurin:17-jre-jammy`): Minimal JRE runtime

### Run

The container requires all datasource variables to connect to MySQL.
Example using `--env-file`:

```bash
docker run -d \
  --name infygo-api \
  --env-file .env \
  -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/infygo?useSSL=false&allowPublicKeyRetrieval=true" \
  -p 8080:8080 \
  infygo-api:latest
```

Or with Docker Compose, add the backend service to `docker-compose.yml`:

```yaml
  api:
    build: .
    ports:
      - "8080:8080"
    env_file: .env
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/infygo?useSSL=false&allowPublicKeyRetrieval=true
    depends_on:
      mysql:
        condition: service_healthy
```

### Health check

The image includes a built-in `HEALTHCHECK` directive:
```
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3
  CMD curl -f http://localhost:8080/InfyGo/actuator/health || exit 1
```

---

## 5. Backend Deployment Guidance & Status

### Deployment Status Summary

| Component | Status | Details |
|---|---|---|
| **Presentation Website** | **LIVE (VERIFIED)** | Deployed on GitHub Pages via Actions: [https://saqibahmadbhat.github.io/infygo-spring-rest-capstone/](https://saqibahmadbhat.github.io/infygo-spring-rest-capstone/) |
| **Local Spring Boot API** | **OPERATIONAL (VERIFIED)** | Context path `/InfyGo` running on port 8080 with H2 or MySQL (`{"status":"UP"}`) |
| **Docker Packaging** | **READY (VERIFIED)** | Multi-stage `Dockerfile` with non-root security and health check |
| **Public Backend API** | **PREPARED (BLOCKED on Cloud Account)** | Configuration and manifests (`railway.json`, `render.yaml`) ready; awaits user-provisioned cloud credentials |

> [!IMPORTANT]
> The Spring Boot REST API is **not** currently hosted on a public cloud service.
> Public deployment requires an external cloud hosting account (e.g. Railway, Render, Fly.io, AWS, GCP)
> and a persistent managed MySQL instance. All production configurations, environment variable fallbacks,
> CORS mappings, and platform manifests have been prepared in the repository.

### 1-Click Cloud Deployment Workflows

#### Option 1: Railway (Recommended for Docker + MySQL)

The repository includes a ready-to-use [`railway.json`](../railway.json) configuration:

1. Create a free account or log in at [railway.com](https://railway.com).
2. Click **New Project** → **Deploy from GitHub repo** → select `infygo-spring-rest-capstone`.
3. In the project canvas, click **New** → **Database** → **Add MySQL**.
4. Railway automatically attaches a persistent storage volume to MySQL.
5. In your backend service's **Variables** tab, add:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useSSL=false&allowPublicKeyRetrieval=true`
   - `SPRING_DATASOURCE_USERNAME`: `${{MySQL.MYSQLUSER}}`
   - `SPRING_DATASOURCE_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
   - `INFYGO_SEED_DEMO_DATA`: `true`
6. In **Settings** → **Networking**, click **Generate Domain** to get your public HTTPS URL (e.g., `https://infygo-backend-production.up.railway.app`).
7. Once deployed, verify via:
   - `GET https://<your-domain>/InfyGo/actuator/health`
   - `GET https://<your-domain>/InfyGo/swagger-ui/index.html`

#### Option 2: Render Blueprint

The repository includes a ready-to-use [`render.yaml`](../render.yaml) blueprint:

1. Sign in to [render.com](https://render.com).
2. Click **New +** → **Blueprint** → connect `SaqibAhmadBhat/infygo-spring-rest-capstone`.
3. Provide your external managed MySQL credentials (or an Aiven/PlanetScale connection string) for `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.
4. Render will automatically build the `Dockerfile` and configure health checks at `/InfyGo/actuator/health`.

#### Option 3: Any Linux VPS (Ubuntu/Debian)

```bash
# Install Java 17 and Docker on the server
sudo apt install -y openjdk-17-jre-headless docker.io docker-compose-plugin

# Pull and run the MySQL container
docker compose up -d mysql

# Copy the JAR (or build on the server)
./mvnw clean package -DskipTests
java -jar target/*.jar
```

#### Option 4: GCP Cloud Run / AWS Fargate / Azure Container Apps

1. Build and push the image to a container registry (GCR, ECR, ACR).
2. Create a managed MySQL instance (Cloud SQL, RDS, Azure Database for MySQL).
3. Deploy the container with the environment variables pointing to the managed DB.

---

## 6. GitHub Pages Presentation

The animated presentation website lives in `presentation/` and is deployed
automatically to GitHub Pages via `.github/workflows/pages.yml`.

### Manual local preview

```bash
cd presentation
npm install
npm run dev          # Dev server at http://localhost:5173/infygo-spring-rest-capstone/
npm run build        # Production build → presentation/dist/
npm run preview      # Preview production build locally
```

### Deployment

Pushing any change to `presentation/**` on the `main` branch triggers the
`pages.yml` workflow, which builds and deploys automatically.

Live URL: **https://saqibahmadbhat.github.io/infygo-spring-rest-capstone/**

