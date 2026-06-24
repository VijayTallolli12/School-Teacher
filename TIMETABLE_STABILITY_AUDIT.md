# Timetable Stability Audit

## Summary

All timetable rendering paths hardened against `undefined`/`null`/missing fields. The app will never crash from malformed timetable API data.

## Files Audited

| File | Risk Before | Risk After | Changes |
|------|-------------|------------|---------|
| `src/api/timetable.ts` | HIGH — raw API data passed through | NONE — `mapPeriodItem`/`mapTimetableDay` provide full defaults | Added defensive mapping functions with fallbacks for every field |
| `src/hooks/useTimetable.ts` | LOW — pass-through only | NONE | No changes needed |
| `src/screens/TimetableScreen.tsx` | HIGH — `weekData[0]` unchecked, key fallbacks missing | NONE | Added `?.` guards, `filter(Boolean)` on `availableDays`, fallback keys |
| `src/components/PeriodCard.tsx` | HIGH — 6 direct field accesses | NONE | All fields use `??` fallback |
| `src/components/CurrentPeriodBanner.tsx` | HIGH — 10+ direct field accesses | NONE | All fields use `?.` + `??` fallback |
| `src/screens/PeriodDetailScreen.tsx` | HIGH — `route.params.period` unchecked, 8+ direct field accesses | NONE | Early return `<EmptyState>` if `period` undefined; all fields use `??` |
| `src/components/DaySelector.tsx` | LOW — static DAYS array, optional `availableDays` | NONE | Already safe |
| `src/components/TimetableHeader.tsx` | LOW — no nested field access | NONE | Already safe |
| `src/components/EmptyTimetableState.tsx` | LOW — wrapper only | NONE | Already safe |

## Crash Vectors Eliminated

### 1. API returns null/undefined
- `api/timetable.ts`: `mapTimetableDay(null)` returns `{ day: '', date: '', periods: [] }`
- `api/timetable.ts`: `mapPeriodItem(null)` returns a fully-defaulted `PeriodItem`

### 2. API returns partial object (missing fields)
Every field now has a fallback:

```
Field              Fallback
──────────────────────────────────
subject            'Unnamed Period'
periodNumber       '?'
startTime          '--:--'
endTime            '--:--'
className          ''
section            ''
room               'Room Not Assigned'
teacher            'Not assigned'
studentCount       0
```

### 3. API `todayData.day` is null/undefined
- `TimetableScreen.tsx`: `!todayData?.day?.periods` guard catches this → shows `<EmptyTimetableState>`

### 4. `route.params.period` is undefined (navigation without params)
- `PeriodDetailScreen.tsx`: early return with `<EmptyState>` before any field access

### 5. Array index access on empty/missing data
- `TimetableScreen.tsx`: `weekData[0]?.day` — optional chaining on index access
- `TimetableScreen.tsx`: `weekData[0]` result checked before use (`if (firstDay)`)

### 6. React key `undefined`
- `period?.id ?? \`period-${index}\`` — both in today and week render

## Guard Pattern Applied

```
period?.field ?? <fallback>
```

Applied consistently across all 4 hardened components. No `if (x)` conditional rendering for field presence — always render with fallback.

## State Coverage

| State | Handling |
|-------|----------|
| Loading | `<SkeletonList count={4} />` |
| API error | `<EmptyTimetableState message="..." />` with pull-to-retry |
| API returns null | `<EmptyTimetableState />` — "No classes today/week" |
| API returns empty array | `<EmptyTimetableState />` — "No classes today/week" |
| API returns empty periods | `<EmptyTimetableState />` with day-specific message |
| Route params undefined | `<EmptyState>` — "Period not found" |
| No more classes today | `<CurrentPeriodBanner>` shows "No more classes today" |
| No classes on selected day | `<EmptyTimetableState>` with "No classes on {day}" |
