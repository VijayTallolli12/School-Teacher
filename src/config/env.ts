/**
 * Environment Configuration
 *
 * Uses Expo's EXPO_PUBLIC_* environment variables.
 * Values are injected at build time by the Expo bundler.
 *
 * Environment files (origin only — the axios client appends /api/v1/... paths):
 *   .env.development  → EXPO_PUBLIC_API_URL=http://192.168.1.3:8000
 *   .env.staging       → EXPO_PUBLIC_API_URL=<staging origin>
 *   .env.production    → EXPO_PUBLIC_API_URL=https://paleturquoise-monkey-126256.hostingersite.com
 *
 * EAS builds override these via the `env` block in eas.json per profile.
 */

export interface EnvConfig {
  API_URL: string;
  ENV_NAME: 'development' | 'staging' | 'production';
  APP_VERSION: string;
  FEATURE_FLAGS: {
    enableNotifications: boolean;
  };
}

function getEnvName(): EnvConfig['ENV_NAME'] {
  const name = process.env.EXPO_PUBLIC_ENV_NAME || 'development';
  if (name === 'staging' || name === 'production') return name;
  return 'development';
}

function getApiUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url) {
    // No silent fallback — a production build must never hit a dev LAN IP.
    // Fail loudly so a missing env var is caught before release.
    console.error(
      '[env] EXPO_PUBLIC_API_URL is not set. API calls will fail. ' +
        'Configure .env.development / .env.staging / .env.production.'
    );
    return '';
  }
  return url.replace(/\/+$/, '');
}

export const ENV: EnvConfig = {
  API_URL: getApiUrl(),
  ENV_NAME: getEnvName(),
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  FEATURE_FLAGS: {
    enableNotifications:
      process.env.EXPO_PUBLIC_ENABLE_NOTIFICATIONS !== 'false',
  },
};

export const isDevelopment = ENV.ENV_NAME === 'development';
export const isStaging = ENV.ENV_NAME === 'staging';
export const isProduction = ENV.ENV_NAME === 'production';
