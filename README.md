# monitoramento-vr

NestJS backend scaffold to receive monitoring data via `POST /monitoramento`.
Built with NestJS + Prisma (SQLite) for **local development** and easy switch to Postgres in production.

## Features
- POST `/monitoramento` accepts an array of shops (or single shop) JSON.
- Validates payload using class-validator.
- Uses Prisma with SQLite locally (`dev.db`).
- Upserts by `cnpj_loja` and stores `updatedAt`.

## Quick start (local)
1. `npm install`
2. `npm run prisma:generate`
3. `npm run prisma:migrate`  # creates dev.db and initial migration
4. `npm run start:dev`
5. POST JSON to `http://localhost:3000/monitoramento`

## Deploy notes (Vercel)
- Vercel ephemeral filesystem means SQLite file won't persist across deployments.
- For production, create a free Postgres provider (Neon, Supabase free tier, Render free) and set `DATABASE_URL` env var in Vercel.
- Prisma works with Postgres with minimal changes.

