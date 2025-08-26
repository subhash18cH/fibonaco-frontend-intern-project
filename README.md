# MAI – Frontend Intern Project: Users Table

Build a production-ready **Users** table in Next.js using **shadcn/ui**, **TanStack Table**, and **TanStack Query**. Use the existing `use-user-pages` hook for data. **Do not modify the backend.**

## Tech Stack & Constraints

* **UI libs allowed:** Next.js, shadcn/ui, TanStack Query, TanStack Table
* **Backend:** FastAPI (Python). API docs: `http://localhost:8000/api/docs`
* **Package manager:** pnpm
* **Backend is final; do not change unless necessary.**

## Important:

It’s okay to submit non-working or non-functional code. The goal is to understand your **thought process** and ability to work with an existing repo.

Use of **any and all AI tools** is allowed. If you use them, include a brief write-up on how you used AI to solve the problem. Smart use of AI is appreciated and will not affect your score negatively, even if all the code was written via prompting.

---

## Setting up the Repository

### Backend

1. Set up a Python virtual environment, activate it, and then install all dependencies from `requirements.txt`.

   * macOS / Unix / Git Bash:

     ```bash
     python -m venv .venv
     source .venv/bin/activate
     ```
   * Windows (cmd or PowerShell):

     ```bat
     .\.venv\Scripts\activate     # cmd
     .\.venv\Scripts\Activate.ps1 # powershell
     ```
2. Navigate to `backend/src/` and run `setup.py`. This creates a **SQLite** DB with dummy data.
3. In `backend/src/`, run `app.py`. The backend API server will start at `http://127.0.0.1:8000/api`.

### Frontend

* Use **pnpm**:

  ```bash
  pnpm install
  pnpm run dev
  ```
* For the final submission you **do not** need a production build. We will test your work with `pnpm run dev`.

---

## What to Build

### Table

Implement the **Users** table with **TanStack Table** + **shadcn/ui** `Table`. <br>
**Columns:** `name`, `email`, `is_superuser`, `is_verified`, `actions`

### Filters (map to server params)

* **Search** → `search` (applies to name + email)
* **SuperUser** → `are_superusers` ∈ `superuser` | `normaluser` | `None` (no filter passed)
* **Verification** → `are_verified` ∈ `verified` | `notverified` | `None` (no filter passed)

### Pagination

* The server-side API accepts the **page number** with filters. If no filters are passed, they are not applied.
* You can check filter params and request handling in `backend/src/app.py`.
  Optionally, visit `http://localhost:8000/api/docs` for JSON schemas.
* **Frontend pagination** occurs via the `use-user-pages.tsx` hook. Read that file carefully to understand how to fetch data correctly.

### Row Actions

Use a **Dropdown Menu** (as shown in the video) with a **Dialog** for each action:

* **Verify User**
* **Toggle Admin**
* **Delete User**

### Basic Guide

* **Data hook:** Use the provided `use-user-pages` as the **single** data source.
* **Optimistic UX:** Disable buttons while pending; show success/error toasts.
* **Debounce filters:** Apply a debounce to filters **before** the hook sends requests to the server.
* **Filters toolbar:** Include **Search** input + **SuperUser** + **Verification**.

---

## Acceptance Criteria (Definition of Done)

* Users table renders via `use-user-pages` with pagination.
* Search, SuperUser, and Verification filters call the server with the **correct params**.
* **Verify (one-time)**, **Toggle Admin**, and **Delete (with confirmation)** work and update the table.
* Only allowed libraries are used (Next.js, shadcn/ui, TanStack Query/Table).
* Code is **clean, typed**, and matches repo patterns.

---

## Notes

* API docs: `http://localhost:8000/api/docs` (FastAPI).
* If the backend returns “already super/regular user,” surface a **non-blocking** toast.

That’s it—build **clean, fast, and predictable**.
