/**
 * Environment Configuration
 *
 * Uses Expo's EXPO_PUBLIC_* environment variables.
 * Values are injected at build time by the Expo bundler.
 *
 * Environment files:
 *   .env.development  → EXPO_PUBLIC_API_URL=http://localhost:8000/api
 *   .env.staging       → EXPO_PUBLIC_API_URL=https://staging-api.example.com/api
 *   .env.production    → EXPO_PUBLIC_API_URL=https://api.example.com/api
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
  return (
    process.env.EXPO_PUBLIC_API_URL ||
    'http://192.168.1.3:8000'
  ).replace(/\/+$/, '');
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
