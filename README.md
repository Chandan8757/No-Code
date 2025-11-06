# NoCode Forms — Minimal Full-stack Demo

This is a minimal full-stack implementation of a no-code dynamic forms app.

## Structure

- server/: Express + Mongoose backend
- client/: Vite + React frontend (minimal)

## Quick start (locally)

1. Make sure you have Node.js and MongoDB installed.

2. Start MongoDB (for example, `mongod`)

3. Server:
   cd server
   npm install
   copy `.env.example` to `.env` and update MONGO_URI
   npm start

4. Client:
   cd client
   npm install
   npm run dev

The client expects the API at http://localhost:4000/api by default.



