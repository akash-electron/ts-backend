## 📦 Installation

```bash
npx install @akash-electron/ts-backend@latest
```

## 🚀 Usage

This package provides a set of utilities and middlewares to build robust TypeScript backends.

### Global Error Handling

```typescript
import express from "express";
import {
  globalErrorHandler,
  AppError,
  catchAsync,
} from "@akash-electron/ts-backend";

const app = express();

// Your routes
app.get(
  "/example",
  catchAsync(async (req, res) => {
    if (!req.query.id) {
      throw new AppError("ID is required", 400);
    }
    res.json({ id: req.query.id });
  }),
);

// Use the global error handler at the end
app.use(globalErrorHandler);
```

---

## 📂 Folder Structure (Inherited)

```text
src/
├── config/             # Configuration files (env vars, database, etc.)
├── controllers/        # Request handlers (processes input/output)
├── middlewares/        # Custom Express middlewares (error, auth, validation)
├── models/             # Data models/schemas (Prisma/Mongoose)
├── routes/             # API route definitions
├── services/           # Business logic (kept separate from controllers)
├── utils/              # Helper functions and utility classes
├── validations/        # Request validation schemas (Zod)
├── types/              # Global TypeScript interfaces & types
├── app.ts              # Express application configuration
└── server.ts           # Entry point and server initialization
```

---

## 🛠️ Key Components & Implementation

### 1. Global Error Handling

We use a centralized error handling mechanism to ensure consistent error responses across the entire application.

- **`AppError` Class**: A custom error class to handle operational errors.
- **`catchAsync` Utility**: A wrapper to eliminate the need for `try-catch` blocks in controllers.
- **Global Error Middleware**: The final destination for all errors.

### 2. Request Validation

Using **Zod** for schema validation ensures that only valid data reaches your business logic. We validate:

- Request Body
- Query Parameters
- URL Parameters

### 3. Business Logic (Services)

Controllers should only handle requests and responses. All "heavy lifting" and business rules are encapsulated in **Services**, making the code testable and reusable.

### 4. Consistent API Responses

All successful responses follow a standard format:

```json
{
  "status": "success",
  "data": { ... }
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Initial Setup

1. **Initialize Project**

   ```bash
   npm init -y
   npm install typescript ts-node nodemon @types/node @types/express express dotenv
   npx tsc --init
   ```

2. **Install Essentials**
   ```bash
   npm install zod cors helmet morgan winston
   npm install -D @types/cors @types/morgan
   ```

---

## 🛡️ Important Files (Quick Reference)

### `src/utils/AppError.ts`

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### `src/middlewares/errorMiddleware.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
```

### `src/utils/catchAsync.ts`

```typescript
import { Request, Response, NextFunction } from "express";

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
```

---

## 📝 Best Practices Included

- **Environment Safety**: Validate `.env` variables at startup.
- **Security Check**: Pre-configured with `helmet` for secure headers.
- **Clean Code**: Deep separation of concerns (Routes → Controllers → Services).
- **Graceful Shutdown**: Handles `SIGTERM` and `SIGINT` signals to close DB connections properly.
