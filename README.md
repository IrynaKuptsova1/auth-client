# Authentication Client

A lightweight React + TypeScript client for a JWT-based authentication flow. The app handles sign-in, sign-up, token refresh, protected requests, and session expiry handling through a small routing layer and API wrapper.

## Overview

This project is the front-end part of an authentication system. It communicates with a backend API using REST endpoints for:

- `/sign-in`
- `/sign-up`
- `/refresh`
- `/me`
- `/health`

The app stores authentication tokens in `localStorage`, redirects users when the session expires, and retries protected requests automatically after token refresh.

## Stack

- React 19
- TypeScript
- Vite
- Wouter for routing
- Zod for validation

## Key Features

- Sign-in and sign-up screens
- Client-side validation for email and password strength
- JWT access and refresh token management
- Automatic refresh flow on `401 Unauthorized`
- Protected profile page using authenticated requests
- Expired-session notification before redirecting to sign-in
- Environment-based backend configuration via `VITE_API_URL`


## File-by-File Summary

### `src/App.tsx`

Defines the app routes:

- `/sign-in`
- `/sign-up`
- `/`

It also calls the backend health endpoint on mount to check service availability.

### `src/api.ts`

This file contains the core authentication logic. The `fetchWithAuth` helper:

- reads the current access token from `localStorage`
- attaches the bearer token to outgoing requests
- detects `401` responses
- refreshes the session once using the refresh token
- retries the original request after successful refresh
- redirects to sign-in when refresh fails or no valid tokens are available

### `src/validation.ts`

Defines the validation rules for authentication inputs with Zod. The schema enforces:

- valid email format
- minimum password length
- uppercase and lowercase characters
- numeric character
- special character

### `src/types.ts`

Contains a small guard helper used to verify that a token value is a non-empty string before using it.

### `src/components/SignIn.tsx`

Renders the sign-in form, validates submitted values, sends credentials to the backend, stores tokens on success, and handles expired-session messaging.

### `src/components/SignUp.tsx`

Renders the registration form, validates password confirmation and password policy, submits the new user payload, and stores the returned tokens.

### `src/components/Home.tsx`

This is a protected page that:

- requests `/me`
- displays the logged-in email
- logs the user out if the request fails
- shows a loading spinner until the profile data is available

### `src/index.css` and `src/App.css`

These files define the styling layer for the project. The app uses a single shared styling approach rather than component-specific CSS modules.

### `src/main.tsx`

Bootstraps the React application and mounts it to the root DOM node.

## Environment Variables

Create a `.env` file in the project root with:

```env
VITE_API_URL=http://localhost:3000
```

The backend URL should point to the authentication server that exposes the endpoints listed above.

## Available Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Notes and Cleanup Opportunities

- The file `src/normalze.css` is likely a legacy typo and should probably be renamed to `normalize.css`.
- The `public/` directory is currently unused and can be removed unless static assets are added later.
- The styling is centralized in a small set of CSS files, which is fine for a small app but may become harder to maintain as the UI grows.

## Summary

This project is a focused front-end authentication client built for a stateless token-based auth system. It is intentionally compact, easy to read, and depends on a backend API that provides session management and protected user data endpoints.
