# Mobile Environment Setup — Teacher App

## Architecture

```
src/config/
 ├── env.ts          ← Reads EXPO_PUBLIC_* variables
 ├── api.ts          ← Axios instance (single source of truth)
 └── constants.ts    ← App-wide constants (URLs, keys, versions)
```

---

## Environment Files

| File | Purpose | Loaded When |
|---|---|---|
| `.env.development` | Local development | `npx expo start` (default) |
| `.env.staging` | QA / Staging | Manual copy to `.env.development` or CI |
| `.env.production` | Production builds | `npx expo start --no-dev` |
| `.env.example` | Template / documentation | Never loaded |

---

## Available Variables

| Variable | Default | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | `http://localhost:3000` | Backend API base URL |
| `EXPO_PUBLIC_ENV_NAME` | `development` | Environment name: `development`, `staging`, `production` |
| `EXPO_PUBLIC_APP_VERSION` | `1.0.0` | App version string |
| `EXPO_PUBLIC_ENABLE_NOTIFICATIONS` | `true` | Feature flag for push notifications |

---

## Local Setup

```bash
# 1. Copy the example env file
cp .env.example .env.development

# 2. Edit .env.development with your local API
#    EXPO_PUBLIC_API_URL=http://localhost:8000/api

# 3. Start the dev server
npx expo start
```

---

## QA / Staging Setup

```bash
# Option A: Overwrite .env.development with staging values
cp .env.staging .env.development
npx expo start

# Option B: Use CI/CD to set variables at build time
EXPO_PUBLIC_API_URL=https://staging-api.example.com/api \
EXPO_PUBLIC_ENV_NAME=staging \
npx expo start
```

---

## Production Setup

Production builds use `.env.production` automatically when running:

```bash
npx expo run:android --variant release
npx expo run:ios --configuration Release
```

For EAS Build:

```bash
eas build --platform android --profile production
eas build --platform ios --profile production
```

Environment variables are configured in `eas.json` for EAS Build.

---

## How It Works

Expo SDK 54 inlines `EXPO_PUBLIC_*` environment variables at build time via Metro:

1. Metro reads `.env.development` (or `.env.production`) during bundling
2. Variables with the `EXPO_PUBLIC_` prefix are replaced in source code
3. `src/config/env.ts` reads these via `process.env.EXPO_PUBLIC_*`
4. `src/config/api.ts` creates the Axios instance with `baseURL: ENV.API_URL`
5. All API services use the centralized `apiClient`

---

## Cross-App Standard

| Aspect | Standard |
|---|---|
| Config directory | `src/config/` |
| Env module | `src/config/env.ts` |
| API client | `src/config/api.ts` |
| Constants | `src/config/constants.ts` |
| Variable prefix | `EXPO_PUBLIC_` |
| Env files | `.env.development`, `.env.staging`, `.env.production` |
| Import path | `../config/env`, `../config/api`, `../config/constants` |

Parent App and Student App must follow the same structure.
