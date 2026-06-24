/**
 * Axios Client (Backward-compatible re-export)
 *
 * This file re-exports the canonical apiClient from src/config/api.ts.
 * Existing API service modules import from here and continue to work.
 *
 * New code should import directly from src/config/api.ts:
 *   import { apiClient } from '../config/api';
 *
 * @see src/config/api.ts
 * @see src/config/env.ts
 */

export { apiClient, default } from '../config/api';
