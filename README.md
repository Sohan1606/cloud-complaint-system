# Cloud Complaint Management System ☁️

Cloud-native full-stack app for complaint management. Deploy to **Render (Backend + PostgreSQL)** + **Vercel (Frontend)**.

## Tech Stack
- **Frontend**: React 18 + Tailwind CSS + React Router
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Auth**: JWT (7-day tokens)
- **Images**: Cloudinary CDN
- **Deploy**: Render + Vercel + GitHub

## 🚀 Quick Local Setup (Docker)

```bash
# Clone & Install
git clone <repo> && cd cloud-complaint-system

# One-command dev (PostgreSQL included)
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/health
# DB: localhost:5432 (postgres/password/complaints)
```

**Admin Login**: `admin@example.com` / `admin123` (auto-seeded)

## 💻 Local Without Docker
```bash
# Backend
cd backend
copy .env.example .env
npm install
npx prisma generate
npx prisma db push  # Needs local PostgreSQL
npm run db:seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## ☁️ Production Deploy (Render + Vercel)

### 1. Backend (Render.com)
```
1. New → Web Service → Connect GitHub repo
2. PostgreSQL → New Database → Copy DATABASE_URL
3. Environment → Paste DATABASE_URL, JWT_SECRET (openssl rand -base64 32)
4. Add Cloudinary vars (optional)
5. Deploy → https://your-app.onrender.com
```

### 2. Frontend (Vercel)
```
1. vercel.com → New Project → Import repo
2. Environment → REACT_APP_API_URL=https://your-backend.onrender.com/api
3. Deploy → Live on vercel.app
```

### 3. Test Production
- Register/Login
- Create complaint + image
- Admin: http://yourapp.vercel.app/admin → Update status

## Environment Variables

**Copy `backend/.env.example` → `.env`**
```
DATABASE_URL=postgresql://... (Render DB)
JWT_SECRET=super-long-random-secret (required)
CLOUDINARY_CLOUD_NAME=... (optional)
```

## API Endpoints
| Method | Endpoint                  | Auth  | Description              |
|--------|---------------------------|-------|--------------------------|
| POST   | `/api/auth/register`      | No    | Create user              |
| POST   | `/api/auth/login`         | No    | JWT login                |
| GET    | `/api/complaints`         | Yes   | List complaints          |
| POST   | `/api/complaints`         | Yes   | Create complaint + image |
| PUT    | `/api/complaints/:id`     | Admin | Update status            |
| GET    | `/health`                 | No    | Health + DB check        |

## Features ✅
- [x] JWT Auth + Protected Routes
- [x] PostgreSQL + Prisma ORM
- [x] Cloudinary Image Upload
- [x] Responsive Tailwind UI (Mobile-first)
- [x] Admin Dashboard + Stats
- [x] Docker Compose (Local PG)
- [x] Render/Vercel Deploy Ready
- [x] Rate Limiting + Helmet Security

## Progress
See [TODO.md](./TODO.md)

**Fully working! 🚀 Local: `docker-compose up` | Deploy: Render + Vercel**

⭐ Star on GitHub!

