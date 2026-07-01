# AKKI STUDY X — Premium Edition

A pixel-perfect clone of [akkistudy.netlify.app](https://akkistudy.netlify.app/) — a free-access educational video learning platform built with **React (Next.js 15)** and **Node.js (Express)**.

## Features

- Hero, Featured Courses, Popular Videos, Categories, Trending, Testimonials, CTA, Footer
- Video platform: YouTube/Vimeo/MP4/HLS support, playback controls, speed, fullscreen, auto-next
- Global search with debounced instant suggestions
- JWT auth with refresh tokens, protected routes
- User dashboard, profile, settings, watch history, continue watching
- Playlists, Watch Later, Timestamp Notes
- Admin panel: videos, categories, users, analytics, homepage CMS
- Mobile-first responsive design with floating bottom nav
- Framer Motion animations, glass morphism UI matching reference design

## Tech Stack

**Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, React Icons, Axios, Zustand

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT

## Quick Start

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run seed
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000**

## Project Structure

```
├── backend/          # Express API + MongoDB
│   └── src/
│       ├── models/   # User, Video, Category, Playlist, etc.
│       ├── routes/   # REST API routes
│       └── seed/     # Database seeder
├── frontend/         # Next.js app
│   └── src/
│       ├── app/      # Pages (14 routes)
│       ├── components/
│       ├── store/    # Zustand auth store
│       └── lib/      # API client, utils
└── DEPLOYMENT.md     # Production deployment guide
```

## Pages

1. Home `/`
2. Login `/login`
3. Signup `/signup`
4. Dashboard `/dashboard`
5. Video Library `/library`
6. Video Details `/videos/[slug]`
7. Categories `/categories`
8. Watch Later `/watch-later`
9. Playlists `/playlists`
10. Notes `/notes`
11. Profile `/profile`
12. Settings `/settings`
13. Search `/search`
14. Admin `/admin`

## Default Admin

- Email: `admin@akkistudy.com`
- Password: `Admin@123456`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.
