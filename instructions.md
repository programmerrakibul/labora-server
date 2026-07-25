# Backend Coding Instructions (Node.js / Express / Mongoose)

You are a senior backend engineer. Follow these rules strictly when generating
or modifying any backend code.

## 1. Project Structure (Domain-Driven)

Organize the codebase using **domain-driven design**:

- Keep each domain self-contained.
- Never place business logic in controllers.
- Prefer composition over inheritance.

## 2. Response Handling

Always use the standardized response utilities:

- `sendResponse()`
- `sendSuccessResponse()`
- `sendErrorResponse()`

**Pagination rule:**

- When returning paginated data, **always** use `getPaginatedData()` and pass
  the result to `sendSuccessResponse`.

Never write raw `res.status().json()` responses.

## 3. Validation (Zod + Type Safety)

- Every request body, query, and params **must** be validated with Zod schemas.
- Use the utility: `parseOrThrow(schema, data)`.
- Define schemas in `validation/` inside each module.
- Infer TypeScript types from Zod schemas (`z.infer<typeof schema>`).
- Never trust `req.body`, `req.query`, or `req.params` without validation.

## 4. Security

- Never expose secrets, internal errors, stack traces, or database details in
  responses.
- Always sanitize and validate ObjectIds.
- Use proper HTTP status codes using http-status package.
- Implement rate limiting, and CORS correctly.
- Never log sensitive data (passwords, tokens, etc.).
- Prefer parameterized queries / Mongoose methods over raw queries.

## 5. Mongoose Modeling

- Define clear, strict schemas with proper types, required fields, indexes, and
  validation.
- Use `timestamps: true`.
- Prefer virtuals and methods over heavy population when possible.
- Always use lean queries (`lean()`) when you only need plain objects.
- Create compound indexes for common query patterns.

## 6. Secrets & Configuration

- Never hardcode secrets.
- Load all configuration from environment variables via a centralized config
  module.
- Never commit `.env` files or reveal API keys, JWT secrets, database URIs, etc.
  in code or comments.

## 7. ObjectId Handling

Always use the shared utilities:

- `validateObjectId(id)` → throws if invalid
- `transformToObjectId(id)` → returns `Types.ObjectId`

Never use `new mongoose.Types.ObjectId()` or `mongoose.isValidObjectId()`
directly in business logic.

## 8. Authorization

- Protect routes with the `authorize([roles])` middleware.
- Example: `authorize(['ADMIN', 'EMPLOYER'])`
- Role checks must happen after authentication middleware.
- Never implement role checks inside controllers or services.

## 9. Code Reusability (No Duplication)

- Extract repeated logic into shared utility functions under `/utils/`.
- Common utilities that must be reused:
  - Response helpers
  - `parseOrThrow`
  - `validateObjectId` / `transformToObjectId`
  - `double(value)` for currency
  - Pagination helpers
  - Error classes
- Do not copy-paste the same validation, transformation, or response logic.

## 10. Dashboard & Activity Stats

Every role (ADMIN, RECRUITER, JOB_SEEKER, etc.) must have:

- Proper dashboard statistics endpoints.
- Activity data for the **last 30 days**.
- Use efficient aggregation pipelines.
- Cache expensive stats when appropriate.
- Return consistent shapes across roles.

## 11. Query Parameters & Filtering

All list endpoints must support proper filtering and pagination via query params
if applicable:

- `search` (text search)
- `page` & `limit` (pagination)
- `category`
- `experienceLevel`
- `location`
- `jobType`
- `status`
- `sortBy` / `sortOrder`
- Date ranges when relevant

Always validate query params with Zod and apply filters safely in the service
layer.

## 12. Currency Handling

- Always treat monetary values as floating-point numbers.
- Convert using the utility: `double(value)`.
- Never store currency as integers or strings unless explicitly required by a
  payment provider.
- Format consistently in responses (e.g., two decimal places when displaying).

## 13. Asset Upload (Cloudinary)

All file uploads (images, resumes/CVs, documents, etc.) **must** use Cloudinary.

### Requirements

- Create a dedicated **Asset** module with:
  - `validation/` – Zod schemas for upload (file type, size, allowed mime types)
  - `interface/` – TypeScript interfaces for Asset
  - `model/` – Mongoose model that stores Cloudinary response data
  - `controller/` – thin controllers
  - `service/` – all business logic (upload, get, delete)

### Endpoints

- `POST /assets/upload` – upload a single file
- `GET /assets/:id` – get asset metadata / signed URL if needed
- `DELETE /assets/:id` – soft or hard delete (also remove from Cloudinary)

### Storage Rules

- Upload the file to Cloudinary first.
- Persist the following fields in the database:
  - `publicId` (Cloudinary public_id) – **required for later deletion**
  - `url` / `secureUrl`
  - `resourceType` (`image` | `raw` | `video`)
  - `format`
  - `bytes`
  - `width` / `height` (when applicable)
  - `originalName`
  - `mimeType`
  - `uploadedBy` (user ObjectId)
  - `folder` / `tags` (optional)

- Always store the Cloudinary `public_id` so the file can be deleted later via
  the Cloudinary API.
- Never store local file paths or temporary buffers in the database.
- Validate file size and mime type **before** uploading to Cloudinary.
- Use multer (memory storage) + Cloudinary SDK.
- Clean up temporary memory after successful upload.
- Protect upload endpoints with authentication + appropriate authorization.

### Deletion

- When deleting an asset, first destroy the resource on Cloudinary using the
  stored `publicId`, then remove or soft-delete the database record.
- Handle Cloudinary deletion errors gracefully and log them.

---

### General Principles

- Prefer arrow functions and dependency injection.
- Keep controllers thin (validate → call service → send response).
- Services contain all business logic.
- Write clean, readable, and maintainable TypeScript (never use `any`).
- Follow consistent naming conventions.
- Add JSDoc only when the intent is not obvious from the code.
- Always handle edge cases and return meaningful error messages.
- If some packages need to be added, use `pnpm add <package_name>`.
- Don't expect logged-in user information from the client; always use `req.user`
  (when authenticated).
