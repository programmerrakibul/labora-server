# AGENTS.md - Labora Server

## Project Overview

Labora Server is a RESTful API backend for an **online job marketplace
platform** built with Node.js, Express v5, TypeScript, MongoDB (Mongoose), and
Better Auth.

**Author:** Md. Rakibul Islam

## Tech Stack

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| Language        | TypeScript 7.x (strict mode, ESM modules)    |
| Runtime         | Node.js                                      |
| Framework       | Express.js v5                                |
| Database        | MongoDB Atlas via Mongoose 9.8               |
| Authentication  | Better Auth (email + password, bearer token) |
| Validation      | Zod v4                                       |
| Pagination      | mongoose-paginate-v2                         |
| File Uploads    | multer (memory) + Cloudinary                 |
| HTTP Errors     | http-errors-enhanced                         |
| HTTP Status     | http-status                                  |
| Package Manager | pnpm                                         |
| Build           | tsc + tsc-alias                              |
| Dev Server      | tsx --watch                                  |
| Deployment      | Vercel (serverless)                          |

## Architecture

Domain-driven design with strict separation of concerns:

```
src/
├── index.ts                    # App entry point, route mounting, middleware
├── config/                     # Auth, DB, Env configuration
├── middlewares/                 # authorize, verify-token, global-error-handler
├── types/                      # Express type augmentation (req.user)
├── utils/                      # Shared utilities (response, pagination, ObjectId, currency)
└── modules/
    └── <domain>/
        ├── interface/          # TypeScript types & enums
        ├── validation/         # Zod schemas + inferred types
        ├── model/              # Mongoose schema & model
        ├── service/            # Business logic (ALL logic lives here)
        ├── controller/         # Thin controllers (validate → call service → send response)
        └── routes/             # Express router definitions
```

## Coding Rules (MUST FOLLOW)

### 1. Controllers are THIN

- Validate input with Zod via `parseOrThrow()`
- Call service function
- Send response with `sendSuccessResponse()` / `sendErrorResponse()`
- NEVER put business logic in controllers

### 2. Response Handling

- Always use `sendResponse()`, `sendSuccessResponse()`, `sendErrorResponse()`
- For paginated data: use `getPaginateData()` then pass to
  `sendSuccessResponse()`
- NEVER write raw `res.status().json()`

### 3. Validation

- Every request body, query, params validated with Zod schemas
- Use `parseOrThrow(schema, data)` utility
- Define schemas in `validation/` inside each module
- Infer TS types from Zod: `z.infer<typeof schema>`

### 4. ObjectId Handling

- Use `validateObjectId(id)` and `transformToObjectId(id)` from
  `@/utils/utils.js`
- NEVER use `new mongoose.Types.ObjectId()` or `mongoose.isValidObjectId()`
  directly

### 5. Authorization

- Protect routes with `authorize(Role.ADMIN, Role.RECRUITER)` middleware
- Role checks happen AFTER authentication middleware
- NEVER implement role checks in controllers or services

### 6. Currency

- Use `double(value)` to convert monetary values to 2 decimal places
- Store as floating-point numbers

### 7. Queries & Filtering

- All list endpoints support: search, page, limit, category, experienceLevel,
  jobType, status, sortBy, sortOrder
- Validate query params with Zod
- Apply filters in service layer

### 8. Security

- Never expose secrets, stack traces, or DB details
- Always sanitize/validate ObjectIds
- Use http-status codes
- Never log sensitive data
- Use `req.user` for authenticated user data, never from client input

## Available Utilities

| Utility                 | Location                                | Purpose                       |
| ----------------------- | --------------------------------------- | ----------------------------- |
| `sendResponse()`        | `@/utils/sendResponse.js`               | Send standardized response    |
| `sendSuccessResponse()` | `@/utils/sendResponse.js`               | Send success response         |
| `sendErrorResponse()`   | `@/utils/sendResponse.js`               | Send error response           |
| `getPaginateData()`     | `@/utils/getPaginateData.js`            | Transform paginate result     |
| `parseOrThrow()`        | `@/utils/utils.js`                      | Validate with Zod schema      |
| `double()`              | `@/utils/utils.js`                      | Round currency to 2 decimals  |
| `validateObjectId()`    | `@/utils/utils.js`                      | Check if ID is valid ObjectId |
| `transformToObjectId()` | `@/utils/utils.js`                      | Convert string to ObjectId    |
| `authorize()`           | `@/middlewares/authorize.js`            | Role-based access control     |
| `verifyToken`           | `@/middlewares/verify-token.js`         | Session/token verification    |
| `globalErrorHandler`    | `@/middlewares/global-error-handler.js` | Centralized error handler     |

## Database Collections

### user

- name, email (unique), image, phoneNumber, role (JOB_SEEKER|RECRUITER|ADMIN),
  address, city, country, emailVerified, isActive, timestamps

### job

- title, company, description, requirements[], responsibilities[], skills[],
  jobType, workLocationType, experienceLevel, location{city,state,country},
  salary{min,max,currency,isNegotiable}, category, tags[], status, postedBy
  (ref: User), expiresAt, timestamps
- Indexes: text (title,description,company,skills), compound
  (status,category,createdAt), compound (status,workLocationType,jobType),
  compound (postedBy,status), TTL (expiresAt)

### application

- jobId (ref: Job), applicantId (ref: User), resumeUrl, coverLetter,
  expectedSalary, status, timestamps
- Unique compound: {jobId, applicantId}
- Indexes: compound (jobId,status,createdAt), compound (applicantId,createdAt)

### asset (to be created)

- publicId, url, secureUrl, resourceType, format, bytes, width, height,
  originalName, mimeType, uploadedBy (ref: User), folder, tags[], timestamps

## API Routes

### Auth (Better Auth - auto-generated)

- `POST /api/auth/sign-up/email`
- `POST /api/auth/sign-in/email`
- `POST /api/auth/sign-out`
- `GET /api/auth/get-session`

### Users

- `GET /api/users` - List users (paginated, admin only)
- `GET /api/users/:id` - Get single user

### Jobs (to be implemented)

- `GET /api/jobs` - List jobs (public, with filtering)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (RECRUITER only)
- `PUT /api/jobs/:id` - Update job (RECRUITER, owner only)
- `DELETE /api/jobs/:id` - Delete job (RECRUITER, owner only)

### Applications (to be implemented)

- `POST /api/applications` - Apply to job (JOB_SEEKER only)
- `GET /api/applications` - List applications (filtered by role)
- `GET /api/applications/:id` - Get single application
- `PUT /api/applications/:id/status` - Update status (RECRUITER/ADMIN)
- `DELETE /api/applications/:id` - Withdraw application (JOB_SEEKER, owner only)

### Assets (to be implemented)

- `POST /api/assets/upload` - Upload file (authenticated)
- `GET /api/assets/:id` - Get asset metadata
- `DELETE /api/assets/:id` - Delete asset (owner only)

### Dashboard (to be implemented)

- `GET /api/dashboard/admin` - Admin stats
- `GET /api/dashboard/recruiter` - Recruiter stats
- `GET /api/dashboard/job-seeker` - Job seeker stats

## Environment Variables

| Variable              | Required | Default  | Description                 |
| --------------------- | -------- | -------- | --------------------------- |
| NODE_ENV              | Yes      | -        | development/production/test |
| PORT                  | No       | 8000     | Server port                 |
| MONGODB_URI           | Yes      | -        | MongoDB Atlas URI           |
| DB_NAME               | No       | "labora" | Database name               |
| CLIENT_URL            | Yes      | -        | Frontend URL for CORS       |
| BETTER_AUTH_SECRET    | Yes      | -        | Better Auth secret key      |
| BETTER_AUTH_URL       | Yes      | -        | Better Auth base URL        |
| CLOUDINARY_CLOUD_NAME | Yes      | -        | Cloudinary cloud name       |
| CLOUDINARY_API_KEY    | Yes      | -        | Cloudinary API key          |
| CLOUDINARY_API_SECRET | Yes      | -        | Cloudinary API secret       |

## Commands

- `pnpm dev` - Start dev server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Run production build
- `pnpm add <package>` - Install new dependency

## Key Conventions

- Arrow functions for all exports
- ESM imports with `.js` extension (e.g., `import X from "./file.js"`)
- Path aliases: `@/*` maps to `./src/*` and `./src/modules/*`
- No `any` types - use proper TypeScript types
- Timestamps enabled on all models
- Virtual `id` enabled on all models
- `versionKey: false` on all models
- Use `lean()` for read-only queries
- Use `PaginateModel` for paginated queries
