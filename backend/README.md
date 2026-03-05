# POS System Backend

This is the backend for the Point of Sale system, built using **Node.js, Express, TypeScript, PostgreSQL, and Prisma**.

## Features
- **JWT Authentication** & Role-Based Access Control (Admin, Manager, Cashier).
- **Users**: CRUD operations, activation/deactivation.
- **Products & Categories**: CRUD, SKU tracking, category relations.
- **Inventory**: Stock tracking, IN/OUT/ADJUSTMENT transactions, low stock alerts.
- **Sales**: Complete sale processing, automatic stock deductions, discount/tax logic, receipts.
- **Reports**: Daily, weekly, monthly sales aggregations, top-selling products.
- **Audit Logs**: Automatic logging of CREATE/UPDATE/DELETE actions performed by users.

## Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL
- Docker & Docker Compose (optional, for containerized run)

## Setup Instructions

### 1. Installation
Clone the repository and install dependencies inside the `backend` folder:
```bash
cd backend
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Update the `DATABASE_URL` and `JWT_SECRET` in `.env`. Leave API keys as placeholders if you don't have them yet.

### 3. Database Setup (Prisma)
Run the following commands to initialize your PostgreSQL database schema:

```bash
# Push the schema to your database
npx prisma db push

# Generate the Prisma Client
npx prisma generate
```

*(Alternatively, use `npx prisma migrate dev` if you want to create formal migration files for production).*

### 4. Seed Dummy Data
To populate the database with an Admin user, categories, and test products:

```bash
npm run seed
```
**Admin Credentials**: 
- Email: `admin@pos.com`
- Password: `admin123`

### 5. Running the API

**Development Mode**:
```bash
npm run dev
```

**Production Mode**:
```bash
npm run build
npm start
```

## Running with Docker

You can spin up both PostgreSQL and the Backend automatically using Docker Compose:

```bash
docker-compose up --build -d
```
The API will be available at `http://localhost:5000`.

## Integrating External API Keys (Payments)
In `.env`, you will find placeholder fields like `STRIPE_API_KEY` or `PAYPAL_CLIENT_ID`. 
Once you register with your chosen payment provider (e.g., Stripe):
1. Copy the Secret Key from their dashboard.
2. Replace the placeholder in `.env`.
3. Restart the server.
4. Call your payment service implementation from `src/services/payment.service.ts` (to be created) during the Checkout/Sale flow.

## API Endpoints Overview

- **Health**: `GET /api/health`
- **Auth**: `POST /api/auth/register`, `/api/auth/login`, `/api/auth/refresh`
- **Users**: `GET /api/users`, `POST /api/users`, `PATCH /api/users/:id`, `DELETE /api/users/:id`
- **Products/Categories**: `/api/products/...`
- **Inventory**: `GET /api/inventory`, `POST /api/inventory`, `GET /api/inventory/alerts`
- **Sales**: `POST /api/sales`, `GET /api/sales/:id`
- **Reports**: `GET /api/reports/daily`, `/api/reports/top-products`
- **Logs**: `GET /api/logs`

*(Check the Postman/ThunderClient collection or specific router files for detailed request payloads).*
