# Teacher Leave Management Module Audit

## Overview

The Leave Management module enables teachers to view their leave balance, browse leave history, apply for new leave, view detailed leave information, and cancel pending requests. The module follows existing codebase patterns and uses only ERP API endpoints.

---

## API Integration

### Endpoints

| Method | Endpoint | Hook | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/teacher/leaves` | `useLeaves()` | All leave applications |
| GET | `/api/v1/teacher/leaves/balance` | `useLeaveBalance()` | Leave balance per type |
| GET | `/api/v1/teacher/leaves/types` | `useLeaveTypes()` | Available leave types |
| GET | `/api/v1/teacher/leaves/:id` | `useLeaveDetail(id)` | Single leave detail |
| POST | `/api/v1/teacher/leaves` | `useApplyLeave()` | Submit new leave request |
| POST | `/api/v1/teacher/leaves/:id/cancel` | `useCancelLeave()` | Cancel pending leave |

**File:** `src/api/leave.ts`

All endpoints use the existing `apiClient` instance (axios with auth interceptor). No new dependencies added.

---

## Data Types (`src/types/index.ts`)

```typescript
type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

interface LeaveType {
  id: string;
  name: string;
  description: string;
  defaultDays: number;
  maxConsecutiveDays: number;
}

interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  total: number;
  used: number;
  remaining: number;
}

interface LeaveItem {
  id: string;
  leaveType: string;
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approver?: string;
  remarks?: string;
  approvalDate?: string;
  attachment?: string;
  timeline?: LeaveTimelineEntry[];
}

interface LeaveTimelineEntry {
  status: LeaveStatus;
  date: string;
  remark?: string;
  updatedBy?: string;
}

interface LeavePayload {
  leaveTypeId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  attachment?: string;
}
```

---

## Workflow

```
LeaveScreen (Dashboard)
  │
  ├── Leave Balance Cards
  │   └── Progress bar per leave type (color-coded by usage)
  │
  ├── Summary Filters (Total / Pending / Approved / Rejected)
  │
  ├── Leave List (filtered)
  │   └── LeaveCard → tap → LeaveDetailScreen
  │       ├── Header (type + status badge + days count)
  │       ├── Info Card (from, to, days, applied, approver, approval date)
  │       ├── Reason section
  │       ├── Remarks section (if any)
  │       ├── Status Timeline (if available)
  │       └── Cancel Request button (only if status is pending)
  │
  └── FAB (+) → LeaveApplyScreen
      └── LeaveForm
          ├── Leave Type (chip selector from API)
          ├── From Date (YYYY-MM-DD text input)
          ├── To Date (YYYY-MM-DD text input)
          ├── Days counter (auto-calculated with validation)
          ├── Reason (multiline text area, min 10 chars)
          └── Submit
```

---

## Components

### LeaveStatusBadge
| Prop | Type | Description |
|------|------|-------------|
| `status` | `LeaveStatus` | pending/approved/rejected/cancelled |

**Colors:** Pending (amber), Approved (green), Rejected (red), Cancelled (gray)

**File:** `src/components/LeaveStatusBadge.tsx`

### LeaveBalanceCard
| Prop | Type | Description |
|------|------|-------------|
| `balances` | `LeaveBalance[]` | Array of per-type balances |

**Renders:** Grid of cards showing leave type name, remaining/total, progress bar (color-coded: green < 50%, amber < 80%, red ≥ 80%), used count.

**File:** `src/components/LeaveBalanceCard.tsx`

### LeaveCard
| Prop | Type | Description |
|------|------|-------------|
| `leave` | `LeaveItem` | Leave record to display |
| `onPress?` | `() => void` | Navigate to detail |

**Renders:** Card with leave type, status badge, date range, day count, reason preview, applied date.

**File:** `src/components/LeaveCard.tsx`

### LeaveTimeline
| Prop | Type | Description |
|------|------|-------------|
| `entries` | `LeaveTimelineEntry[]` | Ordered status changes |

**Renders:** Vertical timeline with colored dots and connecting lines, status labels, dates, remarks, updater names.

**File:** `src/components/LeaveTimeline.tsx`

### LeaveEmptyState
| Prop | Type | Description |
|------|------|-------------|
| `message?` | `string` | Custom message |
| `actionLabel?` | `string` | Button label |
| `onAction?` | `() => void` | Button handler |

**File:** `src/components/LeaveEmptyState.tsx`

### LeaveForm
| Prop | Type | Description |
|------|------|-------------|
| `leaveTypes` | `LeaveType[]` | Available leave types |
| `preselectedTypeId?` | `string` | Pre-selected type |
| `onSubmit` | `(payload) => Promise<void>` | Submit handler |
| `isSubmitting` | `boolean` | Loading state |

**Validation:**
- Leave type: required (chip selector)
- From Date: required, must be valid `YYYY-MM-DD`
- To Date: required, must be valid `YYYY-MM-DD`, must be >= from date
- Max consecutive days: checked against selected leave type's `maxConsecutiveDays`
- Reason: required, minimum 10 characters

**File:** `src/components/LeaveForm.tsx`

---

## React Query Hooks (`src/hooks/useLeave.ts`)

| Hook | Query Key | Stale Time | Notes |
|------|-----------|------------|-------|
| `useLeaves()` | `['leaves']` | 5 min | Full leave list |
| `useLeaveBalance()` | `['leaves', 'balance']` | 10 min | Balance data |
| `useLeaveTypes()` | `['leaves', 'types']` | 30 min | Rarely changes |
| `useLeaveDetail(id)` | `['leaves', id]` | 5 min | Conditional fetch |
| `useApplyLeave()` | — | — | Mutation, invalidates `['leaves']` |
| `useCancelLeave()` | — | — | Mutation, invalidates `['leaves', id]` |

---

## Navigation

### New Routes (AppStack)
| Route Name | Screen | Params |
|------------|--------|--------|
| `Leave` | `LeaveScreen` | `undefined` |
| `LeaveApply` | `LeaveApplyScreen` | `{ leaveType?: string }` |
| `LeaveDetail` | `LeaveDetailScreen` | `{ leaveId: string }` |

### Navigation Flow
- **LeaveScreen → LeaveApply:** FAB (+) press
- **LeaveScreen → LeaveDetail:** LeaveCard tap
- **LeaveApply → back:** On success, auto-navigate back

---

## Files Created

| File | Purpose |
|------|---------|
| `src/api/leave.ts` | 6 API methods |
| `src/hooks/useLeave.ts` | 4 queries + 2 mutations |
| `src/components/LeaveStatusBadge.tsx` | Status badge (4 variants) |
| `src/components/LeaveBalanceCard.tsx` | Balance display with progress bars |
| `src/components/LeaveCard.tsx` | Leave history card |
| `src/components/LeaveTimeline.tsx` | Vertical status timeline |
| `src/components/LeaveEmptyState.tsx` | Empty state with action button |
| `src/components/LeaveForm.tsx` | Apply leave form with validation |
| `src/screens/LeaveScreen.tsx` | Leave dashboard + list with filter |
| `src/screens/LeaveApplyScreen.tsx` | Apply leave form screen |
| `src/screens/LeaveDetailScreen.tsx` | Leave detail with cancel action |
| `TEACHER_LEAVE_AUDIT.md` | This document |

## Files Modified

| File | Change |
|------|--------|
| `src/types/index.ts` | Added `LeaveStatus`, `LeaveType`, `LeaveBalance`, `LeaveItem`, `LeaveTimelineEntry`, `LeavePayload`, response types; updated `AppStackParamList` |
| `src/navigation/AppNavigator.tsx` | Added `Leave`, `LeaveApply`, `LeaveDetail` routes |
| `src/screens/index.ts` | Exports 3 new screens |
| `src/components/index.ts` | Exports 6 new components |

---

## Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| Leave Type | Must be selected | "Leave type is required" |
| From Date | Required, valid YYYY-MM-DD | "Invalid date (YYYY-MM-DD)" |
| To Date | Required, valid YYYY-MM-DD | "Invalid date (YYYY-MM-DD)" |
| Date Range | To ≥ From | "To date must be after from date" |
| Max Days | ≤ leaveType.maxConsecutiveDays | "Max N consecutive days allowed" |
| Reason | Required, ≥ 10 chars | "Please provide a detailed reason" |

---

## Error Handling

| Scenario | UX |
|----------|-----|
| Network error (list) | LeaveEmptyState with "Pull down to retry" |
| Network error (detail) | Centered error with Retry button |
| Validation error | Inline error text below each field |
| API error (apply) | Alert dialog with server message |
| API error (cancel) | Alert dialog with server message |
| Empty list + no filter | LeaveEmptyState with "Apply for Leave" CTA |
| Empty list + filter active | LeaveEmptyState with "{status} leave" message |

---

## Performance

| Strategy | Detail |
|----------|--------|
| **React Query caching** | Leaves: 5min, Balance: 10min, Types: 30min |
| **Conditional fetching** | `useLeaveDetail` only fetches when `leaveId` is truthy |
| **Memoization** | Filtered list, summary counts computed with `useMemo` |
| **Mutation invalidation** | `useApplyLeave` refetches `['leaves']` on success |
| **Pull-to-refresh** | Both list and balance refresh simultaneously |

---

## Verification Checklist

- [x] Leave balance displayed with progress bars per type
- [x] Color-coded balance usage (green/amber/red)
- [x] Leave list with filter chips (Total/Pending/Approved/Rejected)
- [x] Leave cards show type, status badge, dates, days, reason, applied date
- [x] Status badges with consistent colors (pending/approved/rejected/cancelled)
- [x] Apply leave form with type selector, date inputs, reason, validation
- [x] Date range validation (from ≤ to, max consecutive days)
- [x] Days auto-calculated from date range
- [x] Leave detail with full info, reason, remarks, timeline
- [x] Cancel pending leave with confirmation dialog
- [x] Pull-to-refresh on dashboard
- [x] FAB for quick apply
- [x] Empty states with contextual messages and CTA
- [x] Error states with retry support
- [x] No TypeScript errors
- [x] Uses existing ERP APIs only
- [x] No duplicated ERP business logic
