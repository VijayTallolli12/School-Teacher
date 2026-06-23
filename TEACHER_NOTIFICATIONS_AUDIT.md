# Teacher Notifications Audit

## Scope

Phase T6 adds a real-time teacher notification center using the existing teacher ERP API namespace and the existing native FCM/APNs push infrastructure. No backend logic or generated push tokens are introduced in the app.

## API Integration

The API client is implemented in `src/api/notifications.ts` and uses the existing authenticated Axios client.

| Method | ERP endpoint | Purpose |
| --- | --- | --- |
| `getNotifications()` | `GET /api/v1/teacher/notifications` | Fetch the teacher notification list |
| `markAsRead(id)` | `POST /api/v1/teacher/notifications/:id/read` | Mark one notification as read |
| `markAllAsRead()` | `POST /api/v1/teacher/notifications/read-all` | Mark all teacher notifications as read |
| `getUnreadCount()` | `GET /api/v1/notifications/unread-count` | Fetch the authoritative unread count |
| `registerDevice(payload)` | `POST /api/v1/devices/register` | Register the native FCM/APNs device token |

These routes and payloads match the existing ERP route definitions and `DeviceController`. The device request uses `{ device_type, platform, device_token }`.

## React Query

`src/hooks/useNotifications.ts` provides:

- `useNotifications()`
- `useUnreadCount()`
- `useMarkAsRead()`
- `useMarkAllAsRead()`

Read mutations optimistically update the notification list and unread count, then refresh authoritative ERP data. Queries inherit the app's retry policy and expose manual retry/pull-to-refresh behavior.

## Push Flow

The implementation follows Expo SDK 54 `expo-notifications` APIs.

1. The authenticated app mounts `NotificationManager`.
2. Android creates the `teacher-updates` notification channel before requesting permission.
3. Notification permission is read/requested.
4. `getDevicePushTokenAsync()` obtains the native token used by FCM on Android or APNs on iOS.
5. The token is sent to the ERP device-registration endpoint.
6. Token rotation is handled with `addPushTokenListener()`.
7. Foreground receipt and notification-response listeners invalidate the notification list and unread-count queries.
8. The refreshed unread count is synchronized to the application icon badge.

Push notifications require a development or release build on Android; Expo Go does not support remote notifications from SDK 53 onward.

## Unread Count

The unread count is sourced from the ERP unread-count endpoint and displayed in:

- The Dashboard notification card
- The Notifications bottom-tab badge
- The native application icon badge, where supported

Counts over 99 are rendered as `99+` in compact badges.

## Device Registration

Device registration runs only after authentication because `NotificationManager` is mounted only for the authenticated app tree. Tokens are obtained from the operating system and are never hardcoded.

Registration failures are non-fatal to login. They are logged while notification-center API access remains available. A later token rotation triggers registration again.

## UI Coverage

- `NotificationsScreen`
- `NotificationDetailScreen`
- `NotificationCard`
- `NotificationBadge`
- `NotificationFilter`
- `NotificationEmptyState`
- All / Unread / Read filters
- Attendance, Homework, Exam, Fee, Transport, System, and AI Agent types
- Read/unread visual states
- Sent/created display value and notification type supplied by the ERP bell API
- Mark one as read
- Mark all as read
- Skeleton loading
- Pull to refresh
- Empty states
- Network error state and retry

## Type Safety

The notification contracts are defined in `src/types/index.ts`:

- `NotificationItem`
- `NotificationResponse`
- `UnreadCountResponse`
- `NotificationType`
- Device registration and mutation response types

## Configuration

- `expo-notifications` is pinned to the Expo SDK 54-compatible `~0.32.17`.
- The `expo-notifications` config plugin is enabled in `app.json`.
- Android's default channel is `teacher-updates`.

## Verification

- `npx tsc --noEmit`: passing
- No new backend logic
- No hardcoded push token
- Existing authenticated Axios and React Query infrastructure reused
