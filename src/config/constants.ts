/**
 * Application Constants
 *
 * Centralized constants used across the app.
 * Replace placeholder URLs with your actual production URLs.
 *
 * Cross-app standard: Parent App, Teacher App, Student App all
 * share the same config/constants.ts structure.
 */

export const APP_CONSTANTS = {
  APP_VERSION: '1.0.1',

  PRIVACY_POLICY_URL: 'https://school.example.com/privacy',
  TERMS_OF_SERVICE_URL: 'https://school.example.com/terms',

  FEEDBACK_EMAIL: 'support@school.example.com',

  NOTIFICATION_CHANNEL_ID: 'teacher-updates',

  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    TEACHER_PROFILE: 'teacher_profile',
    THEME: 'pref_theme',
    PUSH_NOTIFICATIONS: 'pref_push_notifications',
    EMAIL_NOTIFICATIONS: 'pref_email_notifications',
    SMS_NOTIFICATIONS: 'pref_sms_notifications',
  } as const,
} as const;
