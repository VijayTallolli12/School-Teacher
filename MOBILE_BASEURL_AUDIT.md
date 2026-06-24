# Mobile Base URL Audit — Teacher App

## Audit Scope

Audited all `.ts` and `.tsx` files in `src/` for hardcoded API URLs, base URLs, and direct HTTP references.

---

## Findings

| # | File | Line(s) | Hardcoded Value | Type | Severity | Status |
|---|---|---|---|---|---|---|
| 1 | `src/utils/axios.ts` | 4 | `http://localhost:3000` | API Base URL | **CRITICAL** | ✅ Fixed |
| 2 | `src/screens/ProfileScreen.tsx` | 62 | `https://school.example.com/privacy` | External Link | LOW | ✅ Fixed |
| 3 | `src/screens/ProfileScreen.tsx` | 68 | `https://school.example.com/terms` | External Link | LOW | ✅ Fixed |

---

## Detailed Findings

### 1. `src/utils/axios.ts:4` — CRITICAL

**Before:**
```ts
const API_BASE_URL = 'http://localhost:3000'; // TODO: Move to environment variables
```

**After:**
```ts
// Re-exports apiClient from src/config/api.ts
// baseURL comes from process.env.EXPO_PUBLIC_API_URL via src/config/env.ts
```

**Fix:** Created centralized config structure. `src/config/env.ts` reads `EXPO_PUBLIC_API_URL`. `src/config/api.ts` creates the Axios instance. `src/utils/axios.ts` is a backward-compatible re-export.

---

### 2. `src/screens/ProfileScreen.tsx:62` — LOW

**Before:**
```ts
Linking.openURL('https://school.example.com/privacy')
```

**After:**
```ts
Linking.openURL(APP_CONSTANTS.PRIVACY_POLICY_URL)
```

**Fix:** Moved to `src/config/constants.ts`.

---

### 3. `src/screens/ProfileScreen.tsx:68` — LOW

**Before:**
```ts
Linking.openURL('https://school.example.com/terms')
```

**After:**
```ts
Linking.openURL(APP_CONSTANTS.TERMS_OF_SERVICE_URL)
```

**Fix:** Moved to `src/config/constants.ts`.

---

## Not Affected (Verified Clean)

| Area | Files Checked | Hardcoded URLs Found |
|---|---|---|
| `src/api/*.ts` | 8 | 0 — all use `apiClient` with relative paths |
| `src/hooks/*.ts` | 7 | 0 — all use api service modules |
| `src/screens/*.tsx` | 17 | 0 — all use api service modules |
| `src/components/*.tsx` | 46 | 0 — no direct HTTP calls |
| `src/store/*.ts` | 2 | 0 — uses `authApi` |
| `src/services/*.ts` | 1 | 0 — uses `notificationsApi` |
| `src/utils/*.ts` | 2 | 0 — re-exports from config |
| `src/navigation/*.tsx` | 5 | 0 — no HTTP calls |
| `src/theme/*.ts` | 7 | 0 — no HTTP calls |
| `src/types/*.ts` | 1 | 0 — no HTTP calls |

---

## Summary

- **Total hardcoded URLs found:** 3
- **Critical:** 1 (API base URL — affects all API calls)
- **Low:** 2 (external links — privacy policy, terms of service)
- **Fixed:** 3 / 3 (100%)
- **API base URL:** Now controlled via `EXPO_PUBLIC_API_URL` environment variable
- **External links:** Now centralized in `src/config/constants.ts`
