# Smart Wardrobe

Smart Wardrobe is a Next.js app for clothing catalog management, outfit planning, and role-based administration.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Prisma + PostgreSQL
- NextAuth (credentials)
- bcryptjs for password hashing

## Environment Variables

Create a `.env` file with at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Optional seed variables:

```env
ADMIN_EMAIL="admin@smartwardrobe.local"
ADMIN_PASSWORD="Admin123!"
ADMIN_NAME="Smart Wardrobe Admin"
```

## Setup

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npm run db:generate
```

Push schema to database (dev):

```bash
npm run db:push
```

Create/update an admin user:

```bash
npm run db:seed
```

Run the app:

```bash
npm run dev
```

## Database Commands

```bash
npm run db:generate   # prisma generate
npm run db:push       # prisma db push
npm run db:migrate    # prisma migrate dev
npm run db:seed       # seed admin user
```

## Password Reset Flow

- `POST /api/forgot-password` creates a time-limited token and stores only a token hash.
- `POST /api/reset-password` validates the token hash, expiry, and used state.
- Reset token validity is 30 minutes.
- In development mode, forgot-password response includes a temporary `resetPath` helper.

## Available Features

- Registration and credential login
- Role/status-aware sessions (`USER`, `ADMIN`, `ACTIVE`, `INACTIVE`)
- Wardrobe item CRUD
- Outfit CRUD
- Admin user management (list users, toggle role/status)
- Route protection middleware for dashboard/admin pages
