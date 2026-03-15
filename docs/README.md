# Expelight — Project Documentation

**Expelight** is a full-stack e-commerce platform for premium automotive LED lighting systems. It is the official India partner for Diode Dynamics, offering products such as LED pods, light bars, fog lights, and rock lights with an 8-year warranty.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Further Reading](#further-reading)

---

## Project Overview

Key features:
- Product catalog with categories, variants, beam patterns, and vehicle fitment
- Razorpay payment gateway (INR)
- GST-compliant PDF invoice generation
- WhatsApp invoice delivery via the Meta Business API
- Admin dashboard for managing products, categories, orders, and blog posts
- Advlust / Diode Dynamics product data sync
- User authentication with session-based login
- Educational "Science of Light" content section

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Shadcn UI |
| Routing | Wouter |
| Data Fetching | TanStack Query v5 |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (Neon), Drizzle ORM |
| Authentication | express-session + bcryptjs |
| Payments | Razorpay |
| File Uploads | Multer |
| PDF Generation | PDFKit |
| WhatsApp | Meta Graph API |
| Build Tool | Vite 7 |
| Language Runtime | tsx (TypeScript execution) |

---

## Setup Instructions

### Prerequisites

- Node.js 20 or later
- A PostgreSQL database (Neon recommended)
- A Razorpay account (for payments)
- Optional: A Meta WhatsApp Business API account (for invoice delivery)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd expelight
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example below into a `.env` file (or set them in your host's dashboard) and fill in your values:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SESSION_SECRET=your-long-random-secret-string

RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Optional — required only for WhatsApp invoice delivery
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_meta_access_token
```

> On Replit, set these in the **Secrets** panel (the lock icon in the sidebar). Do not commit them to source control.

### 4. Push the database schema

```bash
npm run db:push
```

This runs Drizzle Kit and syncs all tables to your database. On first run it will create all tables from scratch. The app also auto-seeds products, categories, vehicles, and an admin user on startup.

### 5. Set an admin password

On first startup the seeder creates an admin user. To change the password, log in at `/admin/login` with:

- **Username:** `admin`
- **Password:** `admin123` (default — change this immediately in production)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Full PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret for signing session cookies |
| `RAZORPAY_KEY_ID` | Yes | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay secret key |
| `WHATSAPP_PHONE_NUMBER_ID` | No | Meta Business phone number ID |
| `WHATSAPP_ACCESS_TOKEN` | No | Meta Graph API access token |
| `PORT` | No | HTTP port (defaults to `5000`) |

---

## Running the App

### Development

```bash
npm run dev
```

Starts the Express server (port 5000) with Vite middleware for hot-reloading the React frontend. Everything runs on a single port.

### Production build

```bash
npm run build
npm start
```

`build` compiles the frontend to `dist/public/` and bundles the server to `dist/index.cjs`. `start` runs the compiled server.

### Type checking

```bash
npm run check
```

### Database migrations

```bash
npm run db:push
```

---

## Project Structure

```
expelight/
├── client/                   # React frontend
│   └── src/
│       ├── components/       # Shared UI components
│       ├── hooks/            # Custom React hooks
│       ├── lib/              # API client and query setup
│       └── pages/            # One file per route
├── server/                   # Express backend
│   ├── index.ts              # App entry point
│   ├── routes.ts             # All API route definitions
│   ├── auth.ts               # Session auth setup
│   ├── storage.ts            # Data access layer
│   ├── db.ts                 # Database connection
│   ├── invoiceService.ts     # PDF invoice generation
│   └── whatsappService.ts    # WhatsApp API integration
├── shared/                   # Code shared between client and server
│   ├── schema.ts             # Drizzle table definitions + Zod schemas
│   └── models/               # Auth-specific schema
├── public/                   # Static files served directly
│   ├── uploads/              # Admin-uploaded images
│   └── invoices/             # Generated PDF invoices
├── script/                   # Build and data import scripts
├── docs/                     # This documentation
├── .replit                   # Replit workflow config
├── drizzle.config.ts         # Drizzle Kit config
├── vite.config.ts            # Vite build config
├── tsconfig.json             # TypeScript config
└── package.json
```

---

## Further Reading

- [Backend Documentation](./BACKEND.md) — API routes, authentication, database schema, storage layer
- [Frontend Documentation](./FRONTEND.md) — Pages, routing, components, hooks, data fetching
