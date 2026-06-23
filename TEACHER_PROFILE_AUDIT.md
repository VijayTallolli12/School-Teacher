# Teacher Profile & Settings Module Audit

## Overview

The Profile & Settings module provides teachers with a comprehensive view of their profile information, application preferences, and security management options.

---

## Implemented Features

### Profile Information
| Field | Source | Editable |
|-------|--------|----------|
| Name | `User.name` | No |
| Email | `User.email` | No |
| Phone | `User.phone` | Yes (via `authApi.updateProfile`) |
| Employee ID | `User.employeeId` | No |
| Department | `User.department` | Yes (via `authApi.updateProfile`) |
| Designation | `User.designation` | Yes (via `authApi.updateProfile`) |
| School ID | `User.schoolId` | No |
| Class Assignments | `User.classTeacherAssignments` | No |

### Settings / Preferences
| Setting | Type | Storage |
|---------|------|---------|
| Dark Theme | Toggle (Switch) | AsyncStorage |
| Push Notifications | Toggle (Switch) | AsyncStorage |
| Email Notifications | Toggle (Switch) | AsyncStorage |
| SMS Notifications | Toggle (Switch) | AsyncStorage |

### About
| Item | Action |
|------|--------|
| App Version | Display only (static `1.0.0`) |
| Privacy Policy | Opens URL via `Linking.openURL` |
| Terms of Service | Opens URL via `Linking.openURL` |

### Security
| Feature | Implementation |
|---------|----------------|
| Change Password | Modal with 3 fields, calls `authApi.changePassword` |
| Logout | Confirmation Alert, calls `authApi.logout`, clears local storage |

---

## Architecture

### Data Flow
```
ProfileScreen
  ├── useAuthStore (zustand)     — user data, logout
  ├── useSettingsStore (zustand) — preferences (persisted to AsyncStorage)
  ├── authApi.getProfile()       — fetches full profile
  ├── authApi.updateProfile()    — updates profile fields
  ├── authApi.changePassword()   — changes password
  └── authApi.logout()           — server-side logout
```

### Component Tree
```
ProfileScreen
  ├── ScreenContainer (scrollable)
  │   └── AppHeader ("Profile")
  │   └── SettingsSection ("Profile Information")
  │   │   ├── ProfileCard (avatar + name + email + employeeId)
  │   │   └── InfoRow (Phone, Department, Designation, Employee ID, School ID)
  │   └── SettingsSection ("Class Teacher Assignments") [conditional]
  │   │   └── InfoRow (className → section - subject)
  │   └── SettingsSection ("Preferences")
  │   │   ├── SettingsItem (Dark Theme — Switch)
  │   │   ├── SettingsItem (Push Notifications — Switch)
  │   │   ├── SettingsItem (Email Notifications — Switch)
  │   │   └── SettingsItem (SMS Notifications — Switch)
  │   └── SettingsSection ("About")
  │   │   ├── SettingsItem (App Version)
  │   │   ├── SettingsItem (Privacy Policy → URL)
  │   │   └── SettingsItem (Terms of Service → URL)
  │   └── SettingsSection ("Security")
  │       ├── SettingsItem (Change Password → modal)
  │       └── SettingsItem (Logout → destructive)
  └── ChangePasswordModal (Modal overlay)
```

---

## Components

### ProfileCard
- **Props:** `name`, `email`, `employeeId?`
- **Renders:** Circular avatar with initials, name, email, employee ID subtitle
- **Location:** `src/components/ProfileCard.tsx`

### InfoRow
- **Props:** `label`, `value`
- **Renders:** Label on left, value on right with bottom border
- **Location:** `src/components/InfoRow.tsx`

### SettingsSection
- **Props:** `title`, `children`
- **Renders:** Uppercase section title + white card container with border
- **Location:** `src/components/SettingsSection.tsx`

### SettingsItem
- **Props:** `label`, `value?`, `onPress?`, `showArrow?`, `toggle?`, `onToggle?`, `destructive?`
- **Renders:** Row with label, optional value, optional Switch toggle, optional chevron
- **Location:** `src/components/SettingsItem.tsx`

### ChangePasswordModal
- **Props:** `visible`, `onClose`
- **Renders:** Modal overlay with Current Password, New Password, Confirm Password fields
- **Calls:** `authApi.changePassword()` on submit
- **Location:** `src/components/ChangePasswordModal.tsx`

---

## API Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/v1/teacher/profile` | Fetch teacher profile | Existing |
| PUT | `/api/v1/teacher/profile` | Update profile fields | Added |
| POST | `/api/v1/teacher/change-password` | Change password | Added |
| POST | `/api/v1/teacher/logout` | Logout | Existing |

### Request/Response Types

#### GET /api/v1/teacher/profile
```typescript
// Response
interface ProfileResponse {
  user: User;
}
```

#### PUT /api/v1/teacher/profile
```typescript
// Request
interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
}

// Response
interface ProfileResponse {
  user: User;
}
```

#### POST /api/v1/teacher/change-password
```typescript
// Request
interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Response
{ success: boolean; message?: string }
```

---

## Type Definitions

### New / Extended Types (`src/types/index.ts`)

```typescript
interface TeacherClassAssignment {
  className: string;
  section: string;
  subject: string;
}

interface User {
  // existing fields + new optional fields
  phone?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  classTeacherAssignments?: TeacherClassAssignment[];
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  designation?: string;
}
```

---

## State Management

### useAuthStore (existing — `src/store/authStore.ts`)
- Manages authentication state, user profile, token
- `logout()` — calls API then clears AsyncStorage

### useSettingsStore (new — `src/store/settingsStore.ts`)
- Manages theme preference and notification toggles
- Persists all preferences to AsyncStorage
- Loads preferences on mount via `loadPreferences()`
- Keys: `pref_theme`, `pref_push_notifications`, `pref_email_notifications`, `pref_sms_notifications`

---

## Files Modified

| File | Change |
|------|--------|
| `src/types/index.ts` | Extended `User` interface, added `TeacherClassAssignment`, `ChangePasswordPayload`, `UpdateProfilePayload` |
| `src/api/auth.ts` | Added `updateProfile()` and `changePassword()` methods |
| `src/screens/ProfileScreen.tsx` | Full rewrite with profile + settings + security sections |

## Files Created

| File | Purpose |
|------|---------|
| `src/components/ProfileCard.tsx` | Avatar + name + email + employee ID display |
| `src/components/InfoRow.tsx` | Label-value row for profile details |
| `src/components/SettingsSection.tsx` | Grouped settings section wrapper |
| `src/components/SettingsItem.tsx` | Tappable/toggle settings row |
| `src/components/ChangePasswordModal.tsx` | Modal for change password flow |
| `src/store/settingsStore.ts` | Zustand store for user preferences |

---

## Dependencies

No new dependencies added. Uses:
- `zustand` (existing) for state management
- `@react-native-async-storage/async-storage` (existing) for preference persistence
- `axios` (existing) for API calls
- `@tanstack/react-query` (existing) — available for future server-state profile queries

---

## Verification Checklist

- [x] Profile displays Name, Email, Phone, Employee ID, Department, Designation, School ID
- [x] Class Teacher Assignments shown if data exists
- [x] Theme preference (light/dark) toggle with AsyncStorage persistence
- [x] Push/Email/SMS notification toggles with persistence
- [x] App version displayed
- [x] Privacy Policy link
- [x] Terms of Service link
- [x] Change Password modal with validation (required fields, match check, min 6 chars)
- [x] Logout with confirmation dialog
- [x] No TypeScript errors
- [x] All components follow existing theme and StyleSheet patterns
- [x] All components exported from `src/components/index.ts`
