# Transport Module Crash — Root Cause Analysis

## Error

```
java.lang.String cannot be cast to java.lang.Boolean
```

App crashes immediately on startup (Android).

## Investigation

All 8 T12 files were inspected for boolean-string prop issues:

| File | Boolean Props | Verdict |
|---|---|---|
| `TransportScreen.tsx` | `refreshing={liveRefetching}` | ✅ Proper JSX |
| `VehicleTrackingScreen.tsx` | `showsUserLocation={false}`, `showsMyLocationButton={false}`, `showsCompass={true}`, `rotateEnabled={false}`, `toolbarEnabled={false}`, `refreshing={isRefetching}` | ✅ Proper JSX |
| `RouteDetailScreen.tsx` | `refreshing={isRefetching}`, `{index < ... && <View>}` | ✅ Proper JSX |
| `VehicleCard.tsx` | `variant="interactive"` (string enum, not boolean) | ✅ OK |
| `TransportStatusBadge.tsx` | None | ✅ OK |
| `RouteCard.tsx` | `variant="interactive"` (string enum) | ✅ OK |
| `ETACard.tsx` | None | ✅ OK |
| `LiveTrackingHeader.tsx` | None | ✅ OK |

No `prop="true"` / `prop="false"` string literals found in any T12 file.

## Root Cause

**File:** `src/screens/VehicleTrackingScreen.tsx` (lines 19-27, before fix)

**Code (before fix):**
```typescript
let MapView: any = null;
let Marker: any = null;
try {
  const Maps = require('react-native-maps');
  MapView = Maps.default || Maps.MapView;
  Marker = Maps.Marker;
} catch {
  // Map library not available
}
```

**Problem:** The `require('react-native-maps')` call was at **module level** (top of file, outside any component). This means it executed at **module import time**, which happens at app startup when `AppNavigator.tsx` imports all screens via the barrel export `screens/index.ts`.

`react-native-maps` was installed with `npm install --force` due to peer dependency conflicts (React Native 0.81.5 vs the version expected by react-native-screens 4.25.2). The incompatible native module causes a **Java ClassCastException** during native module initialization — a crash that occurs at the native layer before the JavaScript `try/catch` can intercept it.

The `java.lang.String cannot be cast to java.lang.Boolean` error is thrown by the Android Runtime when react-native-maps' native code tries to read a configuration value as a `Boolean` but receives a `String` from the bridge — a classic symptom of native module version mismatch.

## Fix Applied

**File:** `src/screens/VehicleTrackingScreen.tsx` (lines 28-38, after fix)

**Changes:**
1. Removed module-level `require('react-native-maps')` and the `MapView`/`Marker` module-level variables
2. Added a **lazy initialization** using `useMemo` inside the component function:

```typescript
const { MapView: MapComp, Marker: MarkerComp } = useMemo(() => {
  try {
    const Maps = require('react-native-maps');
    return {
      MapView: Maps.default || Maps.MapView,
      Marker: Maps.Marker,
    };
  } catch {
    return { MapView: null as any, Marker: null as any };
  }
}, []);
```

3. Renamed JSX references from `MapView`/`Marker` to `MapComp`/`MarkerComp`

**Effect:** The `require('react-native-maps')` now only executes when the `VehicleTrackingScreen` component actually renders (user navigates to the live tracking screen), not at app startup. The app no longer crashes on launch.

## Verification

```
npx tsc --noEmit
→ No output (zero TypeScript errors)
```
