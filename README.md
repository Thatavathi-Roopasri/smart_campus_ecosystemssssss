# Smart Campus Ecosystem

A full-stack web application for managing campus activities including events, feedbacks, lost & found items, and student voice.

## Run backend

- Open a terminal in `backend`
- Install deps: `npm install`
- Start: `npm start`
- Backend runs on http://localhost:5000

## Run frontend

- Open a terminal in `frontend`
- Install deps: `npm install`
- Start dev server: `npm start`
- Frontend runs on http://localhost:3000

## API

- GET `http://localhost:5000/api/health` → `{ status: "ok" }`

## Next steps

- Add real endpoints for Events, Track Vault, Feedbacks
- Connect frontend to backend (axios/fetch)
- Implement auth & roles
