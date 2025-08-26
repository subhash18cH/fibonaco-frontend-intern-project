# MAI – Frontend Intern Project: Users Table

Build a production-ready **Users** table in **Next.js** using **shadcn/ui**, **TanStack Table**, and **TanStack Query**.
Use the existing **`use-user-pages`** hook for data. **Do not modify the backend**.

* **UI Libs allowed:** Next.js, shadcn/ui, TanStack Query, TanStack Table
* **Backend:** FastAPI (Python). API docs: `http://localhost:8000/api/docs`
* **Package manager:** `pnpm`
* Backend is final; **do not change until necessary**.

### IMPORTANT:
* **Only use `pnpm` to install anything inside the frontend folder. Everything in the frontend folder is upto you to change. There are some files provided to set you up for the project, if you want you may change those as well.**
* **It is alright to submit non-working or non-functional code. The goal of this text is not to judge your coding skills, but rather your throught proccess and ability to work with existing repos.**
* **Use of ANY and ALL AI Tools is allowed, however if you use them, please submit a small write up along with your submission on how you used AI to solve this problem. Smart use of AI is appreceated and will not take any points away from you, even if all the code was written using only prompting.**

---

## Setting up the Repository

### Backend
1. Setup a Python virtual environment, activate it and the install all the dependencies listed in `requirements.txt`.
  - `python -m venv .venv`
  - `source .venv/bin/activate` on Git Bash / MacOS / Unix Based Terminals.
  - `.\.venv\Scripts\sctivate` or `.\.venv\Scripts\Activate.ps1` for Windows depending on whether you use cmd or powershell.
2. Navigate to `backend/src/` folder and run the `setup.py` file. This will set up a sqlite db for you with dummy data.
3. In `backend/src/` now run `app.py` and it will start the backend API server on `http://127.0.0.1:8000/api`.

### Frontend
1. Package manager used for this project is `pnpm` - its similar to `npm` in every way that matters for this project.
2. Do a `pnpm install` to install the dev dependencies and `pnpm run dev` to start a development server.
3. For the final submission you **DO NOT** have to submit a production build, `pnpm run dev` is the command we will use to test your work.

---

## What to Build

### Table

* Implement Users table with **TanStack Table** + **shadcn/ui Table**.
* **Columns:** `name`, `email`, `is_superuser`, `is_verified`, `actions`

### Filters (map to server params)

* **Search** → `search` (applies to **name + email**)
* **SuperUser** → `are_superusers` ∈ `superuser | normaluser | None (No filter passed)`
* **Verification** → `are_verified` ∈ `verified | notverified | None (No filter passed)`

### Pagination 

Server side API accepts the page number with filter, IF no filters as passed then they are not applied.
You can check the filters params or how the API handles each request in `backend/src/app.py`. Optionally, you can also navigate to `http://localhost:8000/api/docs` once the backend is running to see proper JSON schemas.

Pagination on the frontend occurs via tha `use-user-pages.tsx` hook. Please read that file carefully to understand how to fetch the data properly.

### Row Actions

You need to make this into a Dropdown Menu as shown in the video with a Dialog for each of:
* Verify User
* Toggle Admin
* Delete User

---

## Basic Guide

* **Data hook:** Use the provided `use-user-pages` as the single data source.
* **Optimistic UX:** Disable buttons while pending; show success/error toasts.
* **Debounce Filters:** A Debounce must be applied to the Filters before the hook sends the request to the server.
* **Filters toolbar:** Search input + SuperUser + Verification.


---

## Acceptance Criteria (Definition of Done)

* [ ] Users table renders via **`use-user-pages`** with pagination.
* [ ] **Search**, **SuperUser**, **Verification** filters call the server with correct params.
* [ ] **Verify** (one-time), **Toggle Admin**, **Delete (with confirmation)** work and update the table.
* [ ] Only allowed libs used (Next.js, shadcn/ui, TanStack Query/Table).
* [ ] Code is clean, typed, and matches repo patterns.

---

## Notes

* API docs at `http://localhost:8000/api/docs` (FastAPI).
* If backend returns “already super/regular user,” surface a non-blocking toast.

That’s it—build clean, fast, and predictable.
