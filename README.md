# Cloud Complaint Management System

Full-stack MERN application for managing complaints with image upload and admin dashboard.

## Tech Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express + SQLite (Prisma)
- **Auth**: JWT
- **Image Upload**: Cloudinary
- **Database**: SQLite (free, local)

## Folder Structure
```
cloud-complaint-system/
├── backend/          # Express API server
├── frontend/         # React frontend
├── README.md         # This file
└── TODO.md           # Implementation progress
```

## Quick Setup

### 1. Prerequisites
- Node.js (v18+)
- Cloudinary account (optional for images)

### 2. Backend Setup
```cmd
cd backend
npm install
npx prisma generate
copy .env.example .env
npx prisma db push
```

### 3. Frontend
```cmd
cd ../frontend
npm install
```

### 4. Environment Variables

**backend/.env**:
```
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-key-min-32-chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Run Application

**Terminal 1 - Backend:**
```cmd
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```cmd
cd frontend
npm start
```

Frontend: http://localhost:3000 | Backend API: http://localhost:5000

### 6. Test
1. Register user/admin
2. Login & create complaints (± images)
3. Admin dashboard: Update status

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/complaints` | Yes | Create complaint |
| GET | `/api/complaints` | Yes | All complaints |
| PUT | `/api/complaints/:id/status` | Admin | Update status |

## Features
✅ JWT Auth  
✅ SQLite (free/local)  
✅ Cloudinary Images  
✅ Responsive Tailwind  
✅ Admin Dashboard  
✅ Protected Routes  

## Removed Files (Prisma migration)
- `models/User.js`, `models/Complaint.js` (no longer needed)

**DB ready! Run backend setup commands above, then test app.**

Enjoy! 🚀
