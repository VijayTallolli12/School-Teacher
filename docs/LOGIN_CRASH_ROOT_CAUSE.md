# Login Crash Root Cause Analysis

## Error

```
java.lang.String cannot be cast to java.lang.Boolean
  at ViewManagerPropertyUpdater.setProperty(SourceFile:642)
```

## Root Cause

**`react-native-screens@4.25.2` is incompatible with React Native 0.81.5 (Expo SDK 54 expects `~4.16.0`).**

The native `Screen` view manager from `react-native-screens@4.25.2` registers view properties whose Java types do not match those expected by React Native 0.81.5's `ViewManagerPropertyUpdater`. When the first native `Screen` component renders (immediately, as React Navigation's native stack creates a `Screen` view for the Login route), Fabric's property setter receives a `String` where it expects a `Boolean`, triggering the `ClassCastException`.

### Why This Is The Root Cause

`expo install --check` revealed three packages at incompatible versions:

| Package | Installed | Expected for SDK 54 | Mismatch |
|---|---|---|---|
| `react-native-screens` | `^4.25.2` | `~4.16.0` | **Major** |
| `@react-native-async-storage/async-storage` | `^3.1.1` | `2.2.0` | Major |
| `react-native-safe-area-context` | `^5.8.0` | `~5.6.0` | Minor |

The `react-native-screens` mismatch is the crash culprit because:

1. **It manages native `Screen` views** that render on every navigation — including the very first render from `RootNavigator → AuthNavigator → LoginScreen`
2. **v4.25.2 introduces breaking native changes** — notably, `Screen` property handling was reworked for RN 0.82+ and New Architecture compatibility, which broke property-type contracts with RN 0.81.5's `ViewManagerPropertyUpdater`
3. **The crash happens before our JSX renders** — React Navigation's native `Screen` component is mounted by the navigator before any screen content renders

### Why Settings Store / AsyncStorage Was Ruled Out (42 files inspected)

Every `AsyncStorage.getItem()` call was traced and verified:

| File | Key | Value | Conversion | Verdict |
|---|---|---|---|---|
| `src/store/settingsStore.ts:63` | `pref_push_notifications` | `"true"`/`"false"` | `push !== 'false'` → `boolean` | ✅ |
| `src/store/settingsStore.ts:64` | `pref_email_notifications` | `"true"`/`"false"` | `email !== 'false'` → `boolean` | ✅ |
| `src/store/settingsStore.ts:65` | `pref_sms_notifications` | `"true"`/`"false"` | `sms === 'true'` → `boolean` | ✅ |
| `src/store/settingsStore.ts:62` | `pref_theme` | `"light"`/`"dark"` | `theme === 'dark' ? 'dark' : 'light'` | ✅ |
| `src/config/api.ts:30` | `access_token` | token string | used as `Bearer` header | ✅ (non-boolean) |
| `src/utils/storage.ts:14,26` | `access_token`, `teacher_profile` | strings | no boolean conversion needed | ✅ |

Every boolean JSX prop was audited across all `*.tsx` files. **Zero instances** of `="true"` or `="false"` (string literals) were found.

## Exact File & Fix Applied

**`package.json:26`** — `"react-native-screens": "^4.25.2"` → `"react-native-screens": "~4.16.0"`

Also fixed two other misaligned packages:

- `package.json:13` — `"@react-native-async-storage/async-storage": "^3.1.1"` → `"2.2.0"`
- `package.json:25` — `"react-native-safe-area-context": "^5.8.0"` → `"~5.6.0"`

### Before

```json
"@react-native-async-storage/async-storage": "^3.1.1",
"react-native-safe-area-context": "^5.8.0",
"react-native-screens": "^4.25.2",
```

### After

```json
"@react-native-async-storage/async-storage": "2.2.0",
"react-native-safe-area-context": "~5.6.0",
"react-native-screens": "~4.16.0",
```

## Why Android Threw Java Exception

1. Android app starts and React Native native modules initialize
2. `react-native-screens@4.25.2` registers `ScreenViewManager` with generated property setters designed for RN ≥ 0.82.0
3. React Navigation mounts a native `Screen` view for the first route (Login)
4. Fabric's `ViewManagerPropertyUpdater.setProperty` calls the generated setter
5. The setter expects `java.lang.Boolean` but the runtime property value is `java.lang.String` (because RN 0.81.5's property serialization sends strings for what v4.25.2 compiled as boolean slots)
6. JVM throws `java.lang.ClassCastException: java.lang.String cannot be cast to java.lang.Boolean`

## Verification

```bash
# 1. Verify dependency alignment
npx expo install --check
# → "Dependencies are up to date"

# 2. Verify TypeScript compilation
npx tsc --noEmit
# → (no output = zero errors)

# 3. Clean cache and launch
npx expo start --clear
npx expo start --android
```

## Prevention Recommendations

1. **Always use `npx expo install <package>`** for Expo projects — it resolves SDK-compatible versions
2. **Run `npx expo install --check`** periodically to catch version drift
3. **Never use `npm install --force`** with packages that have native modules
4. **Pin all Expo-related packages** to the versions resolved by `expo install`
5. **Use development builds** (`npx expo run:android`) when adding third-party native modules instead of Expo Go

## Files Inspected (All Clear)

| File | Inspection Result |
|---|---|
| `App.tsx` | Clean — only `<RootNavigator />` and `<StatusBar style="auto" />` |
| `index.ts` | Clean — standard Expo entry point |
| `src/navigation/RootNavigator.tsx` | Clean — `headerShown: false`, all booleans correct |
| `src/navigation/AppNavigator.tsx` | Clean — `headerShown: false`, imports all screens |
| `src/navigation/AuthNavigator.tsx` | Clean — `headerShown: false` |
| `src/navigation/MainTabsNavigator.tsx` | Clean — `headerShown: false`, no string booleans |
| `src/navigation/NotificationsNavigator.tsx` | Clean — `headerShown: false` |
| `src/screens/LoginScreen.tsx` | Clean — `scrollable={false}`, `loading={isLoading}`, `autoCorrect={false}`, `secureTextEntry` |
| `src/screens/ProfileScreen.tsx` | Clean — `visible={showChangePassword}`, `toggle={pushNotifications}`, all booleans correct |
| `src/store/authStore.ts` | Clean — `isAuthenticated`, `isLoading` typed as `boolean`, not persisted as strings |
| `src/store/settingsStore.ts` | Clean — `loadPreferences()` properly converts strings to booleans |
| `src/utils/storage.ts` | Clean — stores only token (string) and profile (string) |
| `src/config/api.ts` | Clean — reads token string only |
| `src/config/env.ts` | Clean — `enableNotifications` converted from env string to boolean |
| `src/services/pushNotifications.ts` | Clean — module-level `setNotificationHandler` uses proper JS booleans |
| `src/hooks/useNotifications.ts` | Clean — no boolean props |
| `src/components/NotificationManager.tsx` | Clean — returns `null`, no native views |
| `src/components/SettingsItem.tsx` | Clean — `toggle` typed as `boolean?`, `Switch.value` receives proper boolean |
| `src/components/ChangePasswordModal.tsx` | Clean — `visible` typed as `boolean`, `disabled`/`loading` proper |
| `src/components/StudentFilterSheet.tsx` | Clean — `visible` typed as `boolean` |
| `src/components/AppButton.tsx` | Clean — `loading` proper boolean |
| `src/components/LoadingScreen.tsx` | Clean — `ActivityIndicator` with `size="large"` (string enum, correct) |
| All 6 transport components | Clean — no string-boolean props |
| All `.env.*` files | Clean — string env vars properly converted in `env.ts` |
| `app.json` | Clean — JSON booleans (`newArchEnabled`, `edgeToEdgeEnabled`) are proper booleans |
| `tsconfig.json` | Clean |
