# DrivingLicenseIssuanceSystem Deployment Runbook

This document provides instructions for deploying and managing the DrivingLicenseIssuanceSystem platform in a production environment.

## 1. Prerequisites
- Docker and Docker Compose installed.
- Port 80 and 443 open.
- Domain name configured (pointing to server IP).

## 2. Initial Deployment
1.  **Clone the repository.**
2.  **Configure environment variables:**
    ```bash
    cp .env.production.example .env.production
    nano .env.production # Fill in real secrets
    ```
3.  **Prepare SSL certificates:**
    - Place `server.crt` and `server.key` in `cert-placeholders/`.
4.  **Launch the stack:**
    ```bash
    docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
    ```

## 3. Database Management
- **Manual Migration:** Migaions run automatically on startup in production.
- **Backup:**
    ```bash
    docker exec DrivingLicenseIssuanceSystem-db-prod /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $DB_PASSWORD -Q "BACKUP DATABASE [DrivingLicenseIssuanceSystemDb] TO DISK = N'/var/opt/mssql/data/DrivingLicenseIssuanceSystemDb.bak' WITH NOFORMAT, NOINIT, NAME = 'DrivingLicenseIssuanceSystemDb-Full', SKIP, NOREWIND, NOUNLOAD, STATS = 10"
    ```

## 4. Monitoring
- **Health Checks:** Access `http://<domain>/health`.
- **Metrics:** Access `http://<domain>/metrics` (internal only via Nginx if restricted).
- **Grafana:** Access `http://<domain>:3001` (Default: admin/admin).

## 5. Troubleshooting
- **Logs:**
    - Backend: `docker logs DrivingLicenseIssuanceSystem-backend-prod`
    - Frontend: `docker logs DrivingLicenseIssuanceSystem-frontend-prod`
    - Nginx: `docker logs DrivingLicenseIssuanceSystem-nginx-prod`
- **Rebuilding Service:**
    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build <service-name>
    ```
