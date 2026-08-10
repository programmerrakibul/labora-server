# API Endpoints

Base URL: `http://localhost:8000/api`

## Authentication

Better Auth handles authentication automatically. Include the bearer token in
the `Authorization` header for protected routes.

```
Authorization: Bearer <token>
```

---

## Auth

| Method | Endpoint              | Body                        | Description         |
| ------ | --------------------- | --------------------------- | ------------------- |
| POST   | `/auth/sign-up/email` | `{ name, email, password }` | Register            |
| POST   | `/auth/sign-in/email` | `{ email, password }`       | Login               |
| POST   | `/auth/sign-out`      | -                           | Logout              |
| GET    | `/auth/get-session`   | -                           | Get current session |

---

## Users

| Method | Endpoint            | Auth          | Description            |
| ------ | ------------------- | ------------- | ---------------------- |
| GET    | `/users`            | Admin         | List users (paginated) |
| GET    | `/users/:id`        | Public        | Get user               |
| PUT    | `/users/profile`    | Authenticated | Update own profile     |
| PATCH  | `/users/:id/status` | Admin         | Toggle active status   |
| PATCH  | `/users/:id/role`   | Admin         | Update user role       |
| DELETE | `/users/:id`        | Admin         | Delete user            |

### GET /users Query Parameters

| Param       | Type    | Default   | Description             |
| ----------- | ------- | --------- | ----------------------- |
| `search`    | string  | -         | Search name or email    |
| `page`      | number  | 1         | Page number             |
| `limit`     | number  | 10        | Items per page (max 50) |
| `role`      | enum    | -         | Filter by role          |
| `isActive`  | boolean | -         | Filter by status        |
| `sortBy`    | enum    | createdAt | Sort field              |
| `sortOrder` | enum    | desc      | Sort direction          |

### PUT /users/profile Body

| Field         | Type   | Required |
| ------------- | ------ | -------- |
| `name`        | string | No       |
| `image`       | string | No       |
| `phoneNumber` | string | No       |
| `address`     | string | No       |
| `city`        | string | No       |
| `country`     | string | No       |

### PATCH /users/:id/status Body

| Field      | Type    | Required |
| ---------- | ------- | -------- |
| `isActive` | boolean | Yes      |

---

## Companies

| Method | Endpoint                             | Auth                | Description                   |
| ------ | ------------------------------------ | ------------------- | ----------------------------- |
| GET    | `/companies`                         | Public              | List/search companies         |
| GET    | `/companies/:id`                     | Public              | Get company profile           |
| POST   | `/companies`                         | Job Seeker          | Create a company              |
| PATCH  | `/companies/:id`                     | Company Owner (own) | Update company profile        |
| DELETE | `/companies/:id`                     | Company Owner (own) | Delete company                |
| POST   | `/companies/:id/join`                | Job Seeker          | Submit join request           |
| DELETE | `/companies/:id/join`                | Authenticated (own) | Cancel own pending request    |
| GET    | `/companies/:id/requests`            | Company Owner (own) | List pending join requests    |
| PATCH  | `/companies/:id/requests/:requestId` | Company Owner (own) | Approve/reject a join request |
| GET    | `/companies/:id/members`             | Company Owner (own) | List approved members         |
| DELETE | `/companies/:id/members/:userId`     | Company Owner (own) | Remove member (frees a seat)  |
| GET    | `/companies/me/membership`           | Authenticated       | Own affiliation status        |
| DELETE | `/companies/me/membership`           | Company Member      | Leave current company         |

### GET /companies Query Parameters

| Param       | Type   | Default   | Description             |
| ----------- | ------ | --------- | ----------------------- |
| `search`    | string | -         | Search name or industry |
| `page`      | number | 1         | Page number             |
| `limit`     | number | 10        | Items per page (max 50) |
| `sortBy`    | enum   | createdAt | Sort field              |
| `sortOrder` | enum   | desc      | Sort direction          |

### POST /companies Body

| Field      | Type               | Required |
| ---------- | ------------------ | -------- |
| `name`     | string             | Yes      |
| `website`  | string (URL)       | No       |
| `industry` | string             | No       |
| `about`    | string             | No       |
| `location` | object             | No       |
| `logo`     | string (asset URL) | No       |

`maxRecruiters`, `ownerId`, `recruiterCount`, and `status` are never accepted
from the client — server-assigned only.

### PATCH /companies/:id/requests/:requestId Body

| Field    | Type | Required |
| -------- | ---- | -------- |
| `status` | enum | Yes      |

**Values**: `APPROVED`, `REJECTED`

### GET /companies/me/membership Response

Returns `status`: `active`, `pending`, or `none` (with company + role when
affiliated).

---

## Jobs

| Method | Endpoint           | Auth                 | Description          |
| ------ | ------------------ | -------------------- | -------------------- |
| GET    | `/jobs`            | Public               | List jobs (filtered) |
| GET    | `/jobs/user`       | Company Owner/Member | My posted jobs       |
| GET    | `/jobs/:id`        | Public               | Get job              |
| POST   | `/jobs`            | Company Owner/Member | Create job           |
| PUT    | `/jobs/:id`        | Company Owner/Member | Update job           |
| PATCH  | `/jobs/:id/status` | Company Owner/Member | Update status        |
| DELETE | `/jobs/:id`        | Company Owner/Member | Delete job           |

### GET /jobs Query Parameters

| Param              | Type   | Default   | Description             |
| ------------------ | ------ | --------- | ----------------------- |
| `search`           | string | -         | Text search             |
| `page`             | number | 1         | Page number             |
| `limit`            | number | 10        | Items per page (max 50) |
| `category`         | string | -         | Filter category         |
| `experienceLevel`  | enum   | -         | Filter experience       |
| `jobType`          | enum   | -         | Filter job type         |
| `workLocationType` | enum   | -         | Filter location type    |
| `status`           | enum   | -         | Filter status           |
| `minSalary`        | number | -         | Minimum salary          |
| `maxSalary`        | number | -         | Maximum salary          |
| `sortBy`           | enum   | createdAt | Sort field              |
| `sortOrder`        | enum   | desc      | Sort direction          |

### POST /jobs Body

| Field              | Type     | Required | Description                                                   |
| ------------------ | -------- | -------- | ------------------------------------------------------------- |
| `title`            | string   | Yes      | Job title (max 100)                                           |
| `description`      | string   | Yes      | Job description                                               |
| `requirements`     | string[] | No       | Requirements list                                             |
| `responsibilities` | string[] | No       | Responsibilities list                                         |
| `skills`           | string[] | No       | Required skills                                               |
| `jobType`          | enum     | Yes      | FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, HOURLY |
| `workLocationType` | enum     | Yes      | ON_SITE, HYBRID, REMOTE                                       |
| `experienceLevel`  | enum     | Yes      | ENTRY_LEVEL, MID_LEVEL, SENIOR_LEVEL, EXECUTIVE               |
| `location`         | object   | No       | `{ city, state, country }`                                    |
| `salary`           | object   | No       | `{ min, max, currency, isNegotiable }`                        |
| `category`         | string   | Yes      | Job category                                                  |
| `tags`             | string[] | No       | Tags list                                                     |
| `status`           | enum     | No       | DRAFT, ACTIVE, PAUSED, CLOSED                                 |
| `expiresAt`        | date     | No       | Expiry date                                                   |

`company` and `companyId` are NOT accepted from the client — they are stamped
server-side from the caller's affiliated company.

### PATCH /jobs/:id/status Body

| Field    | Type | Required |
| -------- | ---- | -------- |
| `status` | enum | Yes      |

---

## Applications

| Method | Endpoint                   | Auth                       | Description       |
| ------ | -------------------------- | -------------------------- | ----------------- |
| GET    | `/applications`            | Role-based                 | List applications |
| GET    | `/applications/:id`        | Authenticated              | Get application   |
| POST   | `/applications`            | Job Seeker                 | Apply to job      |
| PATCH  | `/applications/:id/status` | Company Owner/Member/Admin | Update status     |
| DELETE | `/applications/:id`        | Job Seeker                 | Withdraw          |

### GET /applications Query Parameters

| Param       | Type   | Default   | Description             |
| ----------- | ------ | --------- | ----------------------- |
| `search`    | string | -         | Search                  |
| `page`      | number | 1         | Page number             |
| `limit`     | number | 10        | Items per page (max 50) |
| `status`    | enum   | -         | Filter status           |
| `jobId`     | string | -         | Filter by job           |
| `sortBy`    | enum   | createdAt | Sort field              |
| `sortOrder` | enum   | desc      | Sort direction          |

### POST /applications Body

| Field            | Type   | Required |
| ---------------- | ------ | -------- |
| `jobId`          | string | Yes      |
| `resumeUrl`      | string | Yes      |
| `coverLetter`    | string | No       |
| `expectedSalary` | number | No       |

### PATCH /applications/:id/status Body

| Field    | Type | Required |
| -------- | ---- | -------- |
| `status` | enum | Yes      |

**Status values**: PENDING, REVIEWING, SHORTLISTED, INTERVIEW_SCHEDULED,
REJECTED, HIRED, WITHDRAWN

---

## Assets

| Method | Endpoint         | Auth          | Description  |
| ------ | ---------------- | ------------- | ------------ |
| POST   | `/assets/upload` | Authenticated | Upload file  |
| GET    | `/assets/:id`    | Public        | Get asset    |
| DELETE | `/assets/:id`    | Owner         | Delete asset |

### POST /assets/upload

Content-Type: `multipart/form-data`

| Field    | Type     | Required | Description   |
| -------- | -------- | -------- | ------------- |
| `file`   | file     | Yes      | Max 5MB       |
| `folder` | string   | No       | Upload folder |
| `tags`   | string[] | No       | File tags     |

**Allowed types**: JPEG, PNG, WebP, GIF, PDF, DOC, DOCX

---

## Dashboard

| Method | Endpoint                | Auth                 | Description      |
| ------ | ----------------------- | -------------------- | ---------------- |
| GET    | `/dashboard/admin`      | Admin                | Admin stats      |
| GET    | `/dashboard/recruiter`  | Company Owner/Member | Recruiter stats  |
| GET    | `/dashboard/job-seeker` | Job Seeker           | Job seeker stats |

Returns overview counts, last 30 days activity, and breakdown by status/role.

---

## Enums Reference

### Job Types

`FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `FREELANCE`, `HOURLY`

### Work Location Types

`ON_SITE`, `HYBRID`, `REMOTE`

### Experience Levels

`ENTRY_LEVEL`, `MID_LEVEL`, `SENIOR_LEVEL`, `EXECUTIVE`

### Job Statuses

`DRAFT`, `ACTIVE`, `PAUSED`, `CLOSED`

### Application Statuses

`PENDING`, `REVIEWING`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `REJECTED`,
`HIRED`, `WITHDRAWN`

### User Roles

`JOB_SEEKER`, `COMPANY_MEMBER`, `COMPANY_OWNER`, `ADMIN`

### Company Statuses

`ACTIVE`, `SUSPENDED`

### Membership Statuses

`PENDING`, `APPROVED`, `REJECTED`, `REMOVED`

### Currencies

`USD`, `EUR`, `GBP`, `BDT`

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Paginated

```json
{
  "success": true,
  "message": "Data retrieved",
  "data": [],
  "pagination": {
    "totalDocs": 100,
    "totalPages": 10,
    "page": 1,
    "hasPrevPage": false,
    "hasNextPage": true
  }
}
```

### Error

```json
{
  "success": false,
  "error": "Error message"
}
```
