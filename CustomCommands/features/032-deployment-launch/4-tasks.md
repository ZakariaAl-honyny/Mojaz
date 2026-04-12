# Task List: Deployment & Launch

## Phase 1: Infrastructure Scaffolding
- [ ] Create `nginx.conf` with reverse proxy rules [1-1]
- [ ] Create `docker-compose.prod.yml` with Nginx, Backend, Frontend, and DB [1-2]
- [ ] Create `.env.production.example` template [1-3]

## Phase 2: Backend Production Readiness
- [ ] Implement enhanced Health Checks in `Mojaz.API` (SQL, Disk) [2-1]
- [ ] Implement Prometheus metrics exporter in `Mojaz.API` [2-2]
- [ ] Add auto-migration logic in `Program.cs` for Production environment [2-3]
- [ ] Create `DbInitializer.cs` for system settings and demo data seeding [2-4]

## Phase 3: Monitoring & persistence
- [ ] Add Prometheus and Grafana services to `docker-compose.prod.yml` [3-1]
- [ ] Configure Docker volumes for database and logs persistence [3-2]

## Phase 4: Documentation & Final Polish
- [ ] Create `DEPLOYMENT_RUNBOOK.md` in `docs/` [4-1]
- [ ] Verify Docker Compose production configuration syntax [4-2]
- [ ] Final manual verification of the production stack locally [4-3]
