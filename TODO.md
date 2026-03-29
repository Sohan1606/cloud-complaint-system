# Cloud Complaint System - Docker/Prisma Fix TODO

## Completed:
- [x] Create backend/.env.host for host Prisma commands
- [x] Edit docker-compose.yml (healthcheck + remove db push)

## Remaining Steps:
1. [ ] Run commands: docker compose up -d postgres
2. [ ] cd backend && prisma generate/db push/seed w/ .env.host
3. [ ] docker compose up --build 
4. [ ] Verify localhost:5000/health + :3000 login
5. [ ] Vercel frontend deploy
