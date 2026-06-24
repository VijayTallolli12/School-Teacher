# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Field-Access Safety (Never Crash)

Every field access on API data must use safe fallbacks. Never assume any field exists:

```tsx
// Period/Item fields
period?.subject ?? 'Unnamed Period'
period?.name ?? 'Unnamed'
period?.periodNumber ?? '?'
period?.startTime ?? '--:--'
period?.endTime ?? '--:--'
period?.className ?? ''
period?.section ?? ''
period?.room ?? 'Room Not Assigned'
period?.teacher ?? 'Not assigned'
period?.studentCount ?? 0

// Student fields
student?.name ?? 'Unknown Student'
student?.rollNumber ?? '—'

// Generic patterns
item?.id ?? `fallback-${index}`     // React key fallback
item?.label ?? 'Unnamed Item'
item?.value ?? '—'
```

## Empty State Rules

- API returns null/undefined → show `<EmptyState>` with appropriate message
- API returns empty array → show `<EmptyState>` with "No {items} found"
- API fails → show retry `<EmptyState>` with "Pull down to retry" message
- Screen receives undefined route params → show `<EmptyState>` fallback, never crash
