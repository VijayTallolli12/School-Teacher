# Teacher Timetable Module Audit

## Overview

The Timetable module provides teachers with a modern timeline-style view of their daily and weekly class schedules, with automatic current period detection, period detail access, and quick navigation to attendance marking and homework assignment.

---

## API Integration

### Endpoints

| Method | Endpoint | Hook | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/teacher/timetable/today` | `useTodayTimetable()` | Today's schedule with current/next period detection |
| GET | `/api/v1/teacher/timetable/week` | `useWeeklyTimetable()` | Full weekly schedule grouped by day |
| GET | `/api/v1/teacher/timetable/periods/:id` | `usePeriodDetail(id)` | Detailed info for a single period |

**File:** `src/api/timetable.ts`

All endpoints use the existing `apiClient` instance (axios with auth interceptor). No new dependencies required.

### Response Types

#### Today Timetable
```typescript
interface TodayTimetableResponse {
  data: {
    day: TimetableDay;
    currentPeriod: PeriodItem | null;
    nextPeriod: PeriodItem | null;
  };
}
```

#### Weekly Timetable
```typescript
interface WeeklyTimetableResponse {
  data: TimetableDay[];
}
```

#### Period Detail
```typescript
interface PeriodDetailResponse {
  data: PeriodItem;
}
```

---

## Data Types (`src/types/index.ts`)

```typescript
interface PeriodItem {
  id: string;
  periodNumber: number;
  startTime: string;    // "08:00"
  endTime: string;      // "08:45"
  subject: string;
  className: string;
  section: string;
  room: string;
  teacher: string;
  studentCount: number;
}

type PeriodStatus = 'current' | 'upcoming' | 'completed';

interface TimetableDay {
  day: string;      // "Monday"
  date: string;     // "2026-06-23"
  periods: PeriodItem[];
}
```

---

## Workflow

```
Teacher opens Timetable tab
  │
  ├── TODAY VIEW (default)
  │   ├── CurrentPeriodBanner (current period + next period)
  │   ├── Timeline-style PeriodCard list
  │   │   └── Tap → PeriodDetailScreen
  │   │       ├── Subject header with icon
  │   │       ├── Detail rows (class, teacher, room, time, students)
  │   │       └── Quick Actions
  │   │           ├── Mark Attendance → navigates to Attendance tab
  │   │           └── Assign Homework → navigates to HomeworkCreate (pre-filled)
  │   └── Pull-to-refresh
  │
  └── WEEK VIEW
      ├── Today/Week toggle
      ├── DaySelector (Mon-Sat horizontal tabs)
      ├── PeriodCard list for selected day
      └── Pull-to-refresh
```

### Current Period Logic

The API returns `currentPeriod` and `nextPeriod` fields indicating which periods are active. The client assigns `PeriodStatus` to each card:

| Status | Color | Condition |
|--------|-------|-----------|
| **Current** | Indigo (`#EEF2FF` bg, `#4F46E5` dot) | Period ID matches `currentPeriod` from API |
| **Upcoming** | Emerald (`#F0FDF4` bg, `#10B981` dot) | Period ID matches `nextPeriod` from API, or all previous periods completed |
| **Completed** | Gray (`#F9FAFB` bg, `#9CA3AF` dot) | All other periods in the list |

The `useTodayTimetable` hook auto-refetches every 60 seconds (`refetchInterval: 60 * 1000`) so the current period indicator stays accurate.

---

## Components

### PeriodCard
| Prop | Type | Description |
|------|------|-------------|
| `period` | `PeriodItem` | Period data to display |
| `status` | `'current' \| 'upcoming' \| 'completed'` | Determines card styling |
| `onPress?` | `() => void` | Navigates to period detail |
| `compact?` | `boolean` | Hides class/room details |

**File:** `src/components/PeriodCard.tsx`
**Renders:** Timeline-style card with colored dot indicator, period number, time, subject, status badge, class/room info.

### CurrentPeriodBanner
| Prop | Type | Description |
|------|------|-------------|
| `currentPeriod` | `PeriodItem \| null` | Currently active period |
| `nextPeriod` | `PeriodItem \| null` | Next upcoming period |
| `onCurrentPress?` | `() => void` | Tap to open current period detail |

**File:** `src/components/CurrentPeriodBanner.tsx`
**Renders:** Highlighted banner at top of today view showing NOW (pulsing indigo dot) or NEXT (emerald dot) period.

### DaySelector
| Prop | Type | Description |
|------|------|-------------|
| `selectedDay` | `string` | Currently selected day |
| `onSelectDay` | `(day: string) => void` | Day change handler |
| `availableDays?` | `string[]` | Days that have data (others shown dimmed) |

**File:** `src/components/DaySelector.tsx`
**Renders:** Horizontal scrollable tabs for Mon-Sat with small indicator dots for days that have classes.

### TimetableHeader
| Prop | Type | Description |
|------|------|-------------|
| `mode` | `'today' \| 'week'` | Current view mode |
| `onModeChange` | `(mode) => void` | View toggle handler |
| `dayInfo?` | `string` | Optional day name display |

**File:** `src/components/TimetableHeader.tsx`
**Renders:** Segmented control (Today/Week toggle) with day name on the right.

### EmptyTimetableState
| Prop | Type | Description |
|------|------|-------------|
| `message?` | `string` | Custom empty message |
| `isWeekView?` | `boolean` | Adjusts title text |

**File:** `src/components/EmptyTimetableState.tsx`
**Renders:** Centered empty state with calendar icon and contextual message.

---

## React Query Hooks (`src/hooks/useTimetable.ts`)

| Hook | Query Key | Stale Time | Refetch Interval | Auto-refresh |
|------|-----------|------------|------------------|--------------|
| `useTodayTimetable()` | `['timetable', 'today']` | 5 min | 60s | Auto-refetches every minute for current period accuracy |
| `useWeeklyTimetable()` | `['timetable', 'week']` | 10 min | — | Longer cache for weekly data |
| `usePeriodDetail(id)` | `['timetable', 'period', id]` | 5 min | — | Only fetches when `id` is provided |

All hooks use the standard `@tanstack/react-query` pattern from the existing codebase. The `useTodayTimetable` hook uses `refetchInterval` to keep the current period indicator up-to-date without manual refresh.

---

## Navigation Updates

### New Route
| Stack | Screen | Route Name | Params |
|-------|--------|------------|--------|
| `AppStack` | `PeriodDetailScreen` | `PeriodDetail` | `{ period: PeriodItem }` |

### New Tab
| Tab Navigator | Screen | Label |
|---------------|--------|-------|
| `MainTabs` | `TimetableScreen` | "Timetable" (between Dashboard and Attendance) |

### Navigation flow
- **PeriodDetail → Attendance:** `navigation.navigate('MainTabs', { screen: 'Attendance' })`
- **PeriodDetail → HomeworkCreate:** `navigation.navigate('HomeworkCreate', { initialData })` with pre-filled class/subject/section

---

## Files Created

| File | Purpose |
|------|---------|
| `src/api/timetable.ts` | API service with 3 methods |
| `src/hooks/useTimetable.ts` | 3 React Query hooks |
| `src/components/PeriodCard.tsx` | Timeline-style period card |
| `src/components/CurrentPeriodBanner.tsx` | Now/Next period banner |
| `src/components/DaySelector.tsx` | Horizontal day tabs |
| `src/components/TimetableHeader.tsx` | Today/Week toggle |
| `src/components/EmptyTimetableState.tsx` | Empty state |
| `src/screens/TimetableScreen.tsx` | Main timetable screen |
| `src/screens/PeriodDetailScreen.tsx` | Period detail with quick actions |
| `TEACHER_TIMETABLE_AUDIT.md` | This document |

## Files Modified

| File | Change |
|------|--------|
| `src/types/index.ts` | Added `PeriodItem`, `PeriodStatus`, `TimetableDay`, `TodayTimetableResponse`, `WeeklyTimetableResponse`, `PeriodDetailResponse`; updated `AppStackParamList` and `MainTabParamList` |
| `src/navigation/MainTabsNavigator.tsx` | Added Timetable tab |
| `src/navigation/AppNavigator.tsx` | Added PeriodDetail route |
| `src/screens/index.ts` | Added exports for `TimetableScreen` and `PeriodDetailScreen` |
| `src/components/index.ts` | Added exports for 5 new components |

---

## Performance

| Strategy | Detail |
|----------|--------|
| **React Query caching** | Today: 5min stale, Week: 10min stale |
| **Auto-refetch** | Today timetable refetches every 60s to keep current period accurate |
| **Conditional fetching** | Weekly data only loaded when week view is active; `PeriodDetail` only fetches when navigating |
| **`useMemo`** | Day-to-periods map, available days list, current day name all memoized |
| **No unnecessary refetches** | Standard React Query deduplication; refetchOnWindowFocus disabled globally |

---

## Error Handling

| Scenario | UX |
|----------|-----|
| Network error (today) | Shows EmptyTimetableState with retry message |
| Network error (week) | Shows EmptyTimetableState with retry message |
| Empty timetable | Shows EmptyTimetableState with contextual message |
| Failed refresh | Pull-to-refresh shows error toast via standard error handling |
| 401 (expired token) | Handled globally by axios response interceptor |

---

## Verification Checklist

- [x] Today view displays all periods for the day
- [x] Current period highlighted with indigo styling
- [x] Next period shown in banner and upcoming styling
- [x] Completed periods shown with gray styling
- [x] Week view with day selector (Mon-Sat)
- [x] Day tabs show availability dots
- [x] Empty days show appropriate message
- [x] PeriodDetail screen with full period info
- [x] Quick Action: Mark Attendance navigates to Attendance tab
- [x] Quick Action: Assign Homework navigates to HomeworkCreate with pre-filled data
- [x] Pull-to-refresh on both views
- [x] Today/Week toggle in header
- [x] Auto-refresh every 60s for current period
- [x] Timeline-style layout with visual period indicators
- [x] Skeleton loading via ActivityIndicator
- [x] Empty states for no-data scenarios
- [x] Error states with retry guidance
- [x] No TypeScript errors
- [x] Uses existing ERP APIs only (GET endpoints)
- [x] No duplicated ERP business logic
