# Labora Server

RESTful API backend for an online job marketplace platform.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript 7.x (strict, ESM)
- **Database**: MongoDB Atlas (Mongoose 9.8)
- **Auth**: Better Auth
- **Validation**: Zod v4
- **Upload**: Cloudinary
- **Deploy**: Vercel

## Quick Start

```bash
# Clone
git clone https://github.com/programmerrakibul/labora-server
cd labora-server

# Install
pnpm install

# Configure
cp .env.example .env
# Edit .env with your credentials

# Develop
pnpm dev

# Build
pnpm build

# Start
pnpm start
```

## Project Structure

```
src/
├── config/              # Auth, DB, Env
├── middlewares/          # Auth, error handling
├── types/               # Shared types & augmentations
├── utils/               # Shared utilities
└── modules/
    ├── user/            # User management
    ├── company/         # Company + owner-approved membership
    ├── job/             # Job postings
    ├── application/     # Job applications
    ├── upload/          # File uploads (Cloudinary)
    └── dashboard/       # Role-based stats
```

## Roles

Every account starts as `JOB_SEEKER`. Roles only change server-side as a side
effect of verified company actions:

- `JOB_SEEKER` — default; browses/applies to jobs
- `COMPANY_OWNER` — created a company; manages profile, members, and jobs
- `COMPANY_MEMBER` — approved by an owner; posts/manages jobs
- `ADMIN` — platform moderation

`role` is never accepted from client input, and each user holds at most one
company affiliation at a time.

## Endpoints

See [endpoints.md](./endpoints.md) for the full API reference.

## Environment Variables

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=your_mongodb_uri_string
DB_NAME=labora
CLIENT_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:8000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Author

Md. Rakibul Islam
