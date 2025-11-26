# DevAdminPortal

Admin-only Next.js app to moderate SabPaisa community discussions without touching the public portal. Includes secure login, sidebar-driven UI, live PostgreSQL data via Drizzle, and deletion controls for posts and answers.

## Stack
- Next.js App Router (TypeScript)
- Tailwind CSS
- Drizzle ORM (PostgreSQL)
- SWR + fetch for data fetching
- react-hot-toast for feedback

## Getting Started
1. Copy environment template and fill values:
   ```bash
   cp .env.example .env
   ```
   Required variables:
   - `POSTGRES_URL` (connection string)
   - `ADMIN_USERNAME` (e.g., `vimal`)
   - `ADMIN_PASSWORD` (e.g., `Admin7838`)
   - `ADMIN_SESSION_SECRET` (32+ chars)

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app:
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000/login.

## Database & Drizzle
- Drizzle config: `drizzle.config.ts`
- Schema: `src/lib/schema.ts`
- Commands:
  ```bash
  npm run db:generate   # generate migrations from schema
  npm run db:migrate    # apply migrations
  npm run db:studio     # drizzle studio
  npm run seed          # insert sample post + answers
  ```

## Auth Flow
- Static credentials from env; login sets `admin_session` httpOnly cookie (sameSite=lax, secure in prod).
- Middleware guards `/admin/**` and `/api/admin/**`; redirects to `/login` or returns 403 for APIs.
- `/logout` clears the session cookie.

## API Contract (admin-only)
- `GET /api/admin/community/posts` — list posts with `search`, `category`, `status`, `page`, `pageSize`.
- `DELETE /api/admin/community/posts/:postId` — delete a post (cascade answers).
- `GET /api/admin/community/posts/:postId/answers` — list answers for a post.
- `DELETE /api/admin/community/posts/:postId/answers/:answerId` — delete an answer.
Responses return JSON; 403 on invalid session, 404 on missing records.

## Testing
- Unit tests via Vitest:
  ```bash
  npm test
  ```
- Tests cover auth validation, session tokens, and API auth/behavior.

## Manual QA Checklist
- Wrong credentials keep you on `/login` with an error.
- Correct credentials land on `/admin` dashboard.
- Delete post from list → row disappears and API returns success.
- Delete answer from detail view → card disappears.
- Pagination + filters update the list without reload.
- Logout clears cookie and redirects to `/login`.

## Notes
- UI uses responsive sidebar layout, toasts for success/error, and optimistic updates for deletions.
- Activity logs are recorded in `activity_logs` when deletes occur.
- Public portal reflects deletions immediately because operations act directly on the shared database.
