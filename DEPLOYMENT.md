# NIKU STUDY X — Deployment Guide

## Architecture

- **Frontend**: Next.js 15 (React 19) — port 3000
Default API port: **5001** (5000 may be in use on Windows)
- **Database**: MongoDB

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

## Local Development

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # edit values as needed
npm run seed           # seed database with sample data
npm run dev
```

Default admin credentials after seed:
- Email: `admin@akkistudy.com`
- Password: `Admin@123456`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

Gateway page (Netlify-style): http://localhost:3000/gateway

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| PORT | API server port (default 5000) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Access token secret |
| JWT_REFRESH_SECRET | Refresh token secret |
| CLIENT_URL | Frontend URL for CORS |
| ADMIN_EMAIL | Admin seed email |
| ADMIN_PASSWORD | Admin seed password |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_API_URL | Backend API URL |
| NEXT_PUBLIC_APP_URL | Frontend URL |

## Production Deployment

### Backend (Railway / Render / Heroku)

1. Push `backend/` folder to your repo
2. Set environment variables in dashboard
3. Use MongoDB Atlas for `MONGODB_URI`
4. Set `NODE_ENV=production`
5. Set `CLIENT_URL` to your frontend domain
6. Start command: `npm start`
7. Run seed once: `npm run seed`

### Frontend (Vercel / Netlify)

1. Deploy `frontend/` folder
2. Set `NEXT_PUBLIC_API_URL` to production API URL
3. Build command: `npm run build`
4. Output: Next.js default

### MongoDB Atlas

1. Create free cluster at mongodb.com/atlas
2. Create database user
3. Whitelist IP (0.0.0.0/0 for cloud deploys)
4. Copy connection string to `MONGODB_URI`

### Netlify Gateway (Optional)

Deploy a static redirect page at your domain root pointing to the main app, matching the reference `akkistudy.netlify.app` gateway behavior. The included `/gateway` route replicates this.

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh tokens |
| POST | /api/auth/logout | Logout |
| GET | /api/videos | List videos |
| GET | /api/videos/:slug | Video details |
| GET | /api/categories | List categories |
| GET | /api/homepage | Homepage data |
| GET | /api/admin/analytics | Admin analytics |

Full API documentation available in route files under `backend/src/routes/`.

## Troubleshooting

- **CORS errors**: Ensure `CLIENT_URL` matches your frontend origin exactly
- **Empty homepage**: Run `npm run seed` and ensure MongoDB is running
- **401 errors**: Check JWT secrets match between restarts; clear localStorage tokens
