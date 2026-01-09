Vercel notes:
- Vercel's filesystem is ephemeral. SQLite file will not persist across deploys or cold starts.
- For production on Vercel, use a hosted Postgres (Neon, Supabase free tier, Render free) and set DATABASE_URL accordingly.
- Prisma's client will work with Postgres. Change datasource in prisma/schema.prisma or set DATABASE_URL to PostgreSQL URL.

Example DATABASE_URL for postgres:
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
