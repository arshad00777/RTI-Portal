# RTI e-Filing Portal

A full-stack Right to Information (RTI) e-filing application matching the
architecture: **User → RTI File Website → Register/Login, RTI Apply Form, RTI
Status Tracking → Backend API → RTI Management / Department Directory /
Payment Gateway → PostgreSQL Database → Email/SMS Notify + Admin Dashboard.**

```
rti-portal/
├── backend/     Node.js + Express + Sequelize API
└── frontend/    React + Vite + Tailwind CSS client
```

## Features

- **Register / Login** — JWT-based auth for citizens, PIOs and admins.
- **RTI Apply Form** — file an application against any onboarded department,
  attach a supporting document, mark BPL category for a fee waiver.
- **Payment Gateway** — simulated online payment (UPI / card / net-banking),
  generates a receipt and moves the application to *submitted*.
- **RTI Status Tracking** — public lookup by reference number, no login
  required.
- **Department Directory** — searchable list of public authorities and their
  Public Information Officers (PIOs).
- **RTI Management** — application drafting, document storage, and status
  tracking through the full lifecycle (submitted → under review → info
  provided / rejected / transferred / closed).
- **Email / SMS Notify** — every status change and payment triggers a
  notification (logged to the database and console in this demo; swap in a
  real provider for production).
- **Admin Dashboard** — totals, status breakdown, revenue, and a searchable
  table of every application, with inline status updates for PIOs/admins.

## Tech stack

| Layer      | Choice                                              |
|------------|------------------------------------------------------|
| Frontend   | React 18, Vite, React Router, Tailwind CSS, Axios     |
| Backend    | Node.js, Express, Sequelize, JWT, Multer, bcrypt      |
| Database   | SQLite by default (zero config) — switch to PostgreSQL by changing one `.env` line |

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed     # creates demo admin + citizen accounts and departments
npm run dev       # http://localhost:5000
```

Demo logins created by the seed script:

- **Admin:** `admin@rtiportal.gov.in` / `Admin@123`
- **Citizen:** `asha.verma@example.com` / `Citizen@123`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to the backend, so both
should be running at the same time.

### Switching to PostgreSQL

Edit `backend/.env`:

```
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rti_portal
DB_USER=postgres
DB_PASSWORD=postgres
```

Create the database (`createdb rti_portal`), then run `npm run seed` again.

## API overview

| Method | Route                               | Description                          |
|--------|--------------------------------------|---------------------------------------|
| POST   | `/api/auth/register`                | Create a citizen account              |
| POST   | `/api/auth/login`                   | Log in                                |
| GET    | `/api/auth/me`                      | Current user                          |
| GET    | `/api/departments`                  | Department directory (public)         |
| POST   | `/api/applications`                 | File a new RTI application            |
| GET    | `/api/applications/mine`            | My applications                       |
| GET    | `/api/applications/track/:refNo`    | Public status tracking                |
| GET    | `/api/applications`                 | All applications (admin/PIO)          |
| PATCH  | `/api/applications/:id/status`      | Update status (admin/PIO)             |
| GET    | `/api/payments/fee/:applicationId`  | Get fee for an application            |
| POST   | `/api/payments/checkout`            | Pay and submit an application         |
| GET    | `/api/admin/stats`                  | Dashboard statistics (admin)          |

## Notes for production

- Replace the console-logging notifier in `backend/utils/notify.js` with a
  real email/SMS provider (e.g. SendGrid, Twilio).
- Replace the simulated payment gateway in `backend/routes/payments.js` with
  a real one (e.g. Razorpay, Stripe).
- Set a strong, unique `JWT_SECRET` and run behind HTTPS.
