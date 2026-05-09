# 🧥 Smart Wardrobe

A full-stack digital wardrobe and outfit planner built with **Next.js 16**, **MongoDB Atlas**, **NextAuth.js**, and **pure CSS Modules**.

> **Roll Numbers:** 23i-0739 | 23i-0562  
> **Section:A
> **Course:** Web Programming

---

## 📸 What This App Does

Smart Wardrobe lets users manage their clothing digitally and plan outfits from one place. It has two user roles — **regular users** who manage their own wardrobe, and **admins** who manage the entire platform.

| Feature | Who Can Use |
|---------|------------|
| Register & Login | Everyone |
| Forgot / Reset Password | Everyone |
| Add, Edit, Delete clothing items | Logged-in Users |
| Create and delete Outfits | Logged-in Users |
| View all registered users | Admin only |
| Change user role (USER ↔ ADMIN) | Admin only |
| Toggle user status (ACTIVE / INACTIVE) | Admin only |

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16.2.4 (App Router) | Full-stack — frontend + backend in one project |
| **Language** | TypeScript | Type safety across the codebase |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL database |
| **ODM** | Mongoose 8 | MongoDB schemas and model definitions |
| **Auth** | NextAuth.js v4 | Session management with JWT strategy |
| **Password Hashing** | bcryptjs (cost factor 12) | Secure one-way password hashing |
| **Styling** | Pure CSS Modules | Scoped styles, no Tailwind at runtime |
| **Icons** | Lucide React | Lightweight SVG icon library |
| **Validation** | Custom (lib/validation.ts) | Input sanitization and server-side checks |

---

## 📁 Project Structure

```
smart-wardrobe/
│
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Auth pages — no Navbar layout
│   │   │   ├── login/                 # Login page + CSS
│   │   │   ├── register/              # Registration page + CSS
│   │   │   ├── forgot-password/       # Request reset email
│   │   │   └── reset-password/        # Set new password via token
│   │   │
│   │   ├── (dashboard)/               # Protected pages
│   │   │   ├── wardrobe/              # My Wardrobe — CRUD grid
│   │   │   ├── outfits/               # Outfit builder + saved outfits
│   │   │   │   └── [id]/              # Single outfit detail view
│   │   │   └── admin/                 # Admin user management panel
│   │   │
│   │   ├── api/                       # Backend API routes
│   │   │   ├── auth/[...nextauth]/    # NextAuth handler
│   │   │   ├── register/              # POST — create account
│   │   │   ├── wardrobe/              # GET list / POST create
│   │   │   │   └── [id]/             # PATCH update / DELETE remove
│   │   │   ├── outfits/               # GET list / POST create
│   │   │   │   └── [id]/             # DELETE remove
│   │   │   ├── forgot-password/       # POST — send reset email
│   │   │   ├── reset-password/        # POST — apply new password
│   │   │   └── admin/users/           # GET all / PATCH update
│   │   │       └── [id]/             # PATCH role/status / DELETE
│   │   │
│   │   ├── about/                     # About page
│   │   ├── contact/                   # Contact page
│   │   ├── profile/                   # User profile page
│   │   ├── layout.tsx                 # Root layout (Navbar + Footer on every page)
│   │   ├── page.tsx                   # Landing / Home page
│   │   ├── providers.tsx              # SessionProvider wrapper
│   │   └── globals.css                # Global CSS reset + variables
│   │
│   ├── components/
│   │   ├── Navbar.tsx                 # Sticky nav — role-aware dynamic links
│   │   ├── Navbar.module.css
│   │   ├── Footer.tsx                 # Site footer on every page
│   │   └── Footer.module.css
│   │
│   ├── lib/
│   │   ├── auth.ts                    # NextAuth config (bcrypt compare, JWT, session)
│   │   ├── mongodb.ts                 # Mongoose singleton connection
│   │   └── validation.ts             # Input sanitization helpers + limits
│   │
│   ├── models/                        # Mongoose schemas
│   │   ├── User.ts                    # name, email, passwordHash, role, status
│   │   ├── WardrobeItem.ts            # userId, name, category, color, brand, imageUrl
│   │   ├── Outfit.ts                  # userId, name, occasion
│   │   ├── OutfitItem.ts              # outfitId + wardrobeItemId (join)
│   │   └── PasswordResetToken.ts      # userId, tokenHash, expiresAt, usedAt
│   │
│   ├── scripts/
│   │   └── seed.js                    # Creates/updates the admin account
│   │
│   └── types/
│       └── next-auth.d.ts             # Extends Session/JWT with id, role, status
│
├── middleware.ts                       # Route protection — guards /wardrobe, /outfits, /admin
├── next.config.ts
├── tsconfig.json
├── .env                               # Environment variables (not committed)
└── package.json
```

---

## 🗄️ Database Schema (MongoDB / Mongoose)

### User
```
name          String   required
email         String   required, unique, lowercase
passwordHash  String   required  ← bcrypt hash, NEVER plain text
role          String   "USER" | "ADMIN"   default: "USER"
status        String   "ACTIVE" | "INACTIVE"   default: "ACTIVE"
timestamps    (createdAt, updatedAt auto-managed)
```

### WardrobeItem
```
userId        ObjectId  ref → User   required
name          String    required
category      String    required  (e.g. "Tops", "Bottoms", "Shoes")
color         String    optional
brand         String    optional
imageUrl      String    required  (URL to clothing image)
notes         String    optional
timestamps
```

### Outfit
```
userId        ObjectId  ref → User   required
name          String    required
occasion      String    optional  (e.g. "Casual", "Formal")
timestamps
```

### OutfitItem *(join collection)*
```
outfitId         ObjectId  ref → Outfit        required
wardrobeItemId   ObjectId  ref → WardrobeItem  required
compound index: { outfitId + wardrobeItemId } unique
```

### PasswordResetToken
```
userId      ObjectId  ref → User   required
tokenHash   String    required, unique  ← SHA-256 of raw token, raw token never stored
expiresAt   Date      required          ← 30 minutes from creation
usedAt      Date      optional, null    ← set when token is consumed
timestamps
```

---

## 🔒 Security Implementation

### Password Hashing (Rubric #4, #5, #6)
```
Registration:  bcrypt.hash(password, 12)  → stored as passwordHash
Login:         bcrypt.compare(inputPassword, storedHash)
               ← NEVER string equality comparison
Plain text:    NEVER stored or logged anywhere
```

### Password Reset Security (Rubric #7)
```
1. randomBytes(32) generates raw token
2. SHA-256 hash of token stored in DB (tokenHash)
3. Raw token sent in email link only — never stored
4. Token expires in 30 minutes
5. Token marked used (usedAt set) after one use
6. Same API response whether email exists or not
   → prevents email enumeration attack
```

### Session Security (Rubric #21, #22)
```
Strategy: JWT (stored in HttpOnly cookie)
Session contains: id, name, email, role, status
Sensitive actions re-check session server-side
```

### Route Protection (Rubric #12)
```
middleware.ts runs before every matched request:

/wardrobe/*  → requires valid JWT token
/outfits/*   → requires valid JWT token
/profile/*   → requires valid JWT token
/admin/*     → requires JWT AND role === "ADMIN"

API routes additionally verify session inside the handler
(defense in depth — two layers of protection)
```

### Role-Based Access Control (Rubric #8, #9, #10, #11)
```
Navbar links:   dynamically shown/hidden based on session.user.role
Admin routes:   blocked at middleware for non-ADMIN users
Admin APIs:     double-check role inside the route handler
Admin panel:    view all users, change role, toggle status
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Atlas connection string
MONGODB_URI="mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/SmartWardrobe?retryWrites=true&w=majority"

# NextAuth — generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-long-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional — admin seed account (defaults shown)
ADMIN_EMAIL="admin@smartwardrobe.local"
ADMIN_PASSWORD="Admin123!"
ADMIN_NAME="Smart Wardrobe Admin"
```

> ⚠️ **Never commit `.env` to Git.** It is listed in `.gitignore`.

---

## 🚀 Setup & Run

### Step 1 — Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/smart-wardrobe.git
cd smart-wardrobe
npm install
```

### Step 2 — Configure environment
```bash
# Copy the template and fill in your MongoDB URI and secret
cp .env.example .env
```

### Step 3 — Create admin account
```bash
npm run db:seed
# Creates admin@smartwardrobe.local / Admin123!
# (or whatever ADMIN_EMAIL/ADMIN_PASSWORD you set in .env)
```

### Step 4 — Start the app
```bash
npm run dev
# → http://localhost:3000
```

---

## 🔑 Default Accounts

| Role  | Email | Password |
|-------|-------|---------|
| **Admin** | admin@smartwardrobe.local | Admin123! |

> Regular users can self-register at `/register`.  
> Admin can promote any user to ADMIN from the admin panel.

---

## 📜 Available Scripts

```bash
npm run dev        # Start development server (hot reload)
npm run build      # Build for production
npm run start      # Run production build
npm run lint       # ESLint check
npm run db:seed    # Create/update admin user in MongoDB
```

---

## 🌿 Git Branching Strategy

This project follows a **feature branch workflow**:

```
main
 └── develop
       ├── feature/root-layout
       ├── feature/navbar
       ├── feature/footer
       ├── feature/auth-pages
       ├── feature/wardrobe-crud
       ├── feature/outfit-builder
       ├── feature/admin-panel
       ├── feature/password-reset
       └── feature/public-pages
```

**Commit Convention:**
```
feat(scope):   new feature
fix(scope):    bug fix
style(scope):  CSS/UI only changes
chore:         config, setup, tooling
docs:          README, comments only
```

**Example commits (one file → one commit):**
```bash
git add src/models/User.ts
git commit -m "feat(db): add User Mongoose model — name, email, passwordHash, role, status"

git add src/lib/auth.ts
git commit -m "feat(auth): NextAuth config — bcrypt.compare login, JWT session, role in token"

git add src/middleware.ts
git commit -m "feat(security): route middleware — blocks non-ADMIN from /admin, requires auth on dashboard"
```

---

## 🗺️ Feature-to-File Map

| Feature | Key Files |
|---------|----------|
| User Registration | `api/register/route.ts` · `models/User.ts` · `(auth)/register/page.tsx` |
| Login / Session | `lib/auth.ts` · `api/auth/[...nextauth]/route.ts` · `(auth)/login/page.tsx` |
| Route Protection | `middleware.ts` |
| Wardrobe CRUD | `api/wardrobe/route.ts` · `api/wardrobe/[id]/route.ts` · `models/WardrobeItem.ts` |
| Outfit Builder | `api/outfits/route.ts` · `models/Outfit.ts` · `models/OutfitItem.ts` |
| Password Reset | `api/forgot-password/route.ts` · `api/reset-password/route.ts` · `models/PasswordResetToken.ts` |
| Admin Panel | `api/admin/users/route.ts` · `api/admin/users/[id]/route.ts` · `(dashboard)/admin/page.tsx` |
| Dynamic Navbar | `components/Navbar.tsx` (reads `session.user.role`) |

---

## 📊 Rubric Coverage

| # | Criterion | Implementation |
|---|-----------|---------------|
| 1 | Core features work | Wardrobe CRUD, Outfit builder, Admin panel all functional |
| 2 | Login & Signup | NextAuth CredentialsProvider + `/api/register` |
| 3 | Database CRUD | Mongoose — full Create/Read/Update/Delete on all models |
| 4 | Passwords hashed | `bcrypt.hash(password, 12)` in register + reset APIs |
| 5 | No plain-text passwords | Only `passwordHash` stored; raw password discarded immediately |
| 6 | Secure comparison | `bcrypt.compare()` — never string equality |
| 7 | Secure reset flow | SHA-256 token hash in DB · 30-min expiry · single-use · email enumeration prevention |
| 8 | Two roles defined | `role: "USER" \| "ADMIN"` in User schema |
| 9 | Admin route protected | `middleware.ts` blocks non-ADMIN · API double-checks |
| 10 | Admin manages users | View list · change role · toggle ACTIVE/INACTIVE |
| 11 | Dynamic navigation | Navbar reads `session.user.role` — Admin link only shown to ADMIN |
| 12 | Backend route guards | Middleware + server-side session check in every API handler |
| 13 | Client-side validation | Required field checks, email format, password length on forms |
| 14 | Server-side validation | `lib/validation.ts` sanitizes all inputs before DB operations |
| 15 | Inline error messages | Form errors displayed next to each invalid field |
| 16 | Working navbar | All links functional, no broken routes |
| 17 | Logical page hierarchy | Home → About → Contact → Wardrobe → Outfits → Admin |
| 18 | Responsive navbar | CSS Modules with media queries — hamburger menu on mobile |
| 19 | Consistent layout | CSS custom properties for uniform colors, fonts, spacing |
| 20 | Responsive design | CSS grid `auto-fill` + `minmax()` — adapts to all screen sizes |
| 21 | Login/Logout + sessions | NextAuth JWT cookie · `signOut()` clears session |
| 22 | Session expiry | JWT `maxAge` configured · re-login required after expiry |
| 23 | GitHub repository | Hosted with proper project structure |
| 24 | 10+ meaningful commits | Feature branch commits per file |
| 25 | Commit convention | `feat:`, `fix:`, `style:`, `chore:`, `docs:` prefixes |
| 26 | Footer on all pages | `Footer.tsx` in root `layout.tsx` — renders everywhere |
| 27–32 | Content & creativity | Custom design system · animations · original concept |
| 33 | Performance | Next.js built-in optimization · minimal scripts |
| 34 | README / docs | This file |
| 35 | Demo / walkthrough | Live demo or recorded video |
