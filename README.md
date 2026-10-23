# URLShortener

A full-stack URL shortener with a FastAPI backend and a React frontend. Live at [urlsnip.ca](https://urlsnip.ca).

## Background

I remember when first being sent a biturl link and being amazed when clicking it and seeing the address bar being filled with much more text than what I had clicked.
Having learned more about programming and backend API development, I wanted to give making my own URL shortener a try. I implemented a random key generator that would shorten the URLs
instead of a hashing function because I wanted the same URL to be given two different short URLs. This would make it so the short link generator can delete his/hers short key without affecting
the other(s). I would like to expand this in the future to give more useful link metrics such as unique clicks, visits per time frame, and visits by location.

## Features

- Shorten any valid URL into a short, random key
- Per-link admin/secret key for deleting a link without an account required

## Architecture

```
backend/    FastAPI app (API + redirect service)
frontend/   React + Vite + Tailwind UI
```

### Backend (`backend/`)

- **FastAPI** app exposing the shortening API and the redirect endpoint
- **SQLAlchemy** models backed by SQLite locally (`shortener.db`) or Postgres in production
- **cachetools** `TTLCache` to avoid hitting the DB on every redirect for popular links
- Settings loaded via `pydantic-settings` from a `.env` file ([`backend/config.py`](backend/config.py))

| Endpoint              | Method | Description                                           |
| --------------------- | ------ | ----------------------------------------------------- |
| `/`                   | GET    | Health check                                          |
| `/{url_key}`          | GET    | Redirect to the target URL and record a click         |
| `/url`                | POST   | Create a new shortened URL                            |
| `/admin/{secret_key}` | GET    | Fetch stats (clicks, short URL, admin URL) for a link |
| `/admin/{secret_key}` | DELETE | Deactivate a link                                     |

### Frontend (`frontend/`)

- React 19 + Vite + TypeScript
- Tailwind CSS v4 + shadcn/base-ui components
- React Router for client-side routing (home, new URL, delete, contact, 404)
- Deployed to Cloudflare Workers/Pages (`wrangler`)

## Getting started

### Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

uvicorn backend.main:app --reload
```

Configure via a `.env` file at the project root:

```env
env_name=Local
base_url=http://localhost:8000
db_url=sqlite:///./shortener.db
allowed_origins=http://localhost:5173
```

The API will be available at `http://localhost:8000`, with interactive docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

- **Backend**: deployed to [Render](https://render.com) via [`render.yaml`](render.yaml), running `uvicorn backend.main:app`.
- **Frontend**: deployed to Cloudflare via `npm run deploy` (`wrangler deploy`), configured in [`frontend/wrangler.jsonc`](frontend/wrangler.jsonc).

## Tech stack

**Backend:** FastAPI, SQLAlchemy, Pydantic, cachetools, Uvicorn, PostgreSQL/SQLite
**Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn, React Router
