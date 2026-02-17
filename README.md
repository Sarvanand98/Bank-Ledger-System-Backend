# Bank Ledger Backend

A simple bank‑style ledger API built with Node.js, Express and MongoDB.  
Main features:

- User registration and login
- JWT‑based authentication (HTTP‑only cookie or `Authorization: Bearer` header)
- Multiple accounts per user
- Account opening and balance check
- Money transfers with idempotency keys (duplicate‑safe)
- Initial funding for system users
- Basic email notifications for transactions

---

## 1. Getting Started

### 1.1 Prerequisites

- Node.js (LTS)
- npm
- MongoDB database (cloud or local)

### 1.2 Install dependencies

```bash
npm install
```

### 1.3 Configure environment

Create a `.env` file in the project root and configure database, JWT and email settings as required by the codebase.

> Do **not** commit `.env` to version control. It is already ignored via `.gitignore`.

### 1.4 Run the server

```bash
npm start
# or
npm run dev   # if you have a dev script
```

Default base URL:

```text
http://localhost:3000
```

---

## 2. Authentication & Authorization

- On successful login, the API sets a JWT token as an HTTP‑only cookie (and also accepts a Bearer token in the `Authorization` header).
- Protected routes use the middleware in `src/middleware/auth.middleware.js`.

Ways to send the token:

1. **Cookie (recommended)** – keep the `token` cookie from `/api/auth/login`.
2. **Authorization header**

   ```http
   Authorization: Bearer <JWT_TOKEN>
   ```

---

## 3. API Reference

Base URL:

```text
http://localhost:3000
```

---

### 3.1 Auth Routes

Base path: `/api/auth`

#### 3.1.1 Register (Create User)

```http
POST /api/auth/register
```

**Body**

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "secret123"
}
```

Registers a new user.

---

#### 3.1.2 Login

```http
POST /api/auth/login
```

**Body**

```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

On success returns user data and sets a `token` cookie.

---

#### 3.1.3 Logout

```http
POST /api/auth/logout
```

Invalidates the current JWT (blacklist) and clears the cookie.

---

### 3.2 Account Routes

Base path: `/api/account`  
All account routes require authentication.

#### 3.2.1 Open New Account

```http
POST /api/account/open
```

**Body**

```json
{
  "currency": "INR"
}
```

Creates a new account for the logged‑in user in the given currency (default `INR`).

**Example success response**

```json
{
  "success": true,
  "account": {
    "_id": "ACCOUNT_ID",
    "user": "USER_ID",
    "currency": "INR",
    "status": "ACTIVE"
  }
}
```

---

#### 3.2.2 Get All Accounts for Current User

```http
POST /api/account/
```

(Implemented as `POST` even though it behaves like a `GET`.)

Returns all accounts that belong to the authenticated user.

```json
{
  "success": true,
  "accounts": [
    {
      "_id": "ACCOUNT_ID",
      "user": "USER_ID",
      "currency": "INR",
      "status": "ACTIVE"
    }
  ]
}
```

---

#### 3.2.3 Get Account Balance

```http
GET /api/account/balance/:AccountId
```

Returns the current balance of the given account if it belongs to the logged‑in user.

```json
{
  "success": true,
  "AccountId": "ACCOUNT_ID",
  "balance": 1000
}
```

---

### 3.3 Transaction Routes

Base path: `/api/transaction`

#### 3.3.1 Create Money Transfer

```http
POST /api/transaction/
```

Transfers money between two accounts.

**Body**

```json
{
  "fromAccount": "FROM_ACCOUNT_ID",
  "toAccount": "TO_ACCOUNT_ID",
  "amount": 200,
  "idempotencyKey": "unique-key-123"
}
```

- `fromAccount` must belong to the logged‑in user.
- `amount` must be positive.
- `idempotencyKey` avoids duplicate transfers (same key will not create the transfer twice).

**Example success response**

```json
{
  "success": true,
  "transaction": {
    "_id": "TRANSACTION_ID",
    "fromAccount": "FROM_ACCOUNT_ID",
    "toAccount": "TO_ACCOUNT_ID",
    "amount": 200,
    "status": "COMPLETED",
    "idempotencyKey": "unique-key-123"
  }
}
```

---

#### 3.3.2 Create Initial Funds (System User)

```http
POST /api/transaction/system/intial-funds
```

> Path uses `intial-funds` (typo kept from code).

**Body**

```json
{
  "toAccount": "ACCOUNT_ID",
  "amount": 1000,
  "idempotencyKey": "initial-fund-001"
}
```

Adds initial funds from a system account to the given account.  
Protected by `authSystemUserMiddleware` – only system users can call this.

---

### 3.4 Transaction History (optional)

You can extend the API with endpoints like:

```http
GET /api/transaction            # list all transactions for current user
GET /api/transaction/:id        # get single transaction by id
```

Actual path/implementation depends on how you wire the controller.

---

## 4. Email Notifications

`src/services/email.services.js` configures an SMTP transport.  
Controllers can use it to send emails:

- **On success** – “Transaction Successful” with amount, from/to accounts, and new balance.
- **On failure** – “Transaction Failed” with the error reason (e.g. insufficient balance).

Emails are best‑effort; transaction APIs should still respond even if sending email fails.

---

## 5. Error Format

Typical error JSON:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Optional extra detail"
}
```

Common status codes: `400`, `401`, `403`, `404`, `500`.

---
