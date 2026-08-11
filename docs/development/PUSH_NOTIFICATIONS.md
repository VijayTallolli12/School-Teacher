# Push Notification Development Mode

## What Was Disabled

Expo SDK 54 does not support remote push notifications inside **Expo Go**. To prevent crashes and runtime errors, all push notification registration and listener setup is skipped when `__DEV__` is `true`.

### Files Modified

**1. `src/services/pushNotifications.ts`**

| Change | Location |
|---|---|
| Module-level `setNotificationHandler()` call wrapped with `if (!__DEV__ && Platform.OS !== 'web')` | Lines 8-17 |
| `registerForPushNotifications()` returns `null` immediately when `__DEV__` is `true` | Line 20 |

**2. `src/components/NotificationManager.tsx`**

| Change | Location |
|---|---|
| Main `useEffect` body exits early when `__DEV__` is `true` | Line 14 |
| Badge count `useEffect` exits early when `__DEV__` is `true` | Line 54 |

### What Still Works

- App launches normally
- Dashboard
- Attendance
- Homework
- Exams
- Notifications (in-app notification list via React Query, without push)
- All other screens and features

### Verification

- TypeScript compiles with zero errors (`npx tsc --noEmit`)
- The `__DEV__` global is a standard React Native/Expo constant (`true` in dev, `false` in production)

---

## How to Re-Enable for Production

1. Remove the `if (__DEV__) return;` guards
2. Remove the `if (!__DEV__ && ...)` wrapper on `setNotificationHandler()`

Alternatively, build a **production bundle** (where `__DEV__` is `false`) — the guards automatically allow push notifications.

---

## Development Build Requirements

To test push notifications during development (without Expo Go):

| Step | Command | Notes |
|---|---|---|
| 1. Install `expo-dev-client` | `npx expo install expo-dev-client` | Required for development builds |
| 2. Create a development build | `npx expo run:android` or `npx expo run:ios` | Builds a native app with push support |
| 3. Run the dev build | `npx expo start --dev-client` | The `__DEV__` guards no longer block push |

**Important:** The `__DEV__` guard is a development-only measure. In the production APK/IPA, `__DEV__` evaluates to `false`, so all push notification code runs normally.

---

## Additional Considerations

- **Badge count:** `Notifications.setBadgeCountAsync()` is also guarded by `__DEV__`. Badges are restored in production builds and dev builds.
- **Push token listener:** `Notifications.addPushTokenListener()` is skipped in dev mode. The token is automatically registered after an app update in production via the listener.
- **Backend registration:** The `POST /api/v1/devices/register` call is skipped entirely in dev mode, preventing 401/redirect errors.
