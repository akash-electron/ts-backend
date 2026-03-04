## 🚀 Quick Start

Initialize your new TypeScript backend project in seconds:

```bash
# Create a new project in the current directory
npx @akash-electron/ts-backend .

# OR create a new project in a new folder
npx @akash-electron/ts-backend my-backend-api
```

## 📦 What's Included?

This package is a full-featured boilerplate generator that sets up:

- **TypeScript** pre-configured for Node.js
- **Express 5** for modern routing
- **Zod** for schema validation
- **Winston & Morgan** for structured logging
- **CatchAsync & AppError** for clean, centralized error handling
- **Security** with `helmet` and `cors`
- **Developer Experience** with `nodemon` and `ts-node`

---

## 📂 Project Structure

```text
src/
├── config/             # Env vars, database, and logger config
├── controllers/        # Request/Response logic
├── middlewares/        # Error handlers, auth, etc.
├── models/             # Data schemas
├── routes/             # API endpoints
├── services/           # Business logic
├── utils/              # Global helpers (AppError, catchAsync)
├── validations/        # Zod validation schemas
├── types/              # TS interface definitions
├── app.ts              # Express setup
└── server.ts           # Server entry point
```

## 🛠️ Usage Post-Initialization

Once you run the initialization command:

1. **Install Dependencies**
   ```bash
   npm install
   ```
2. **Setup Environment**
   Rename `.env.example` to `.env` and configure your variables.
3. **Run in Development**
   ```bash
   npm run dev
   ```
4. **Build for Production**
   ```bash
   npm run build
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
