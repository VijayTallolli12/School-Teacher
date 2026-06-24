# Teacher Exams Module — Audit Report

## API Integration

| Endpoint | Method | File | Status |
|---|---|---|---|
| `/api/v1/teacher/exams` | GET | `src/api/exams.ts:5` | Done |
| `/api/v1/teacher/exams/:id` | GET | `src/api/exams.ts:13` | Done |
| `/api/v1/teacher/exams/:id/schedule` | GET | `src/api/exams.ts:21` | Done |
| `/api/v1/teacher/exams/:id/classes` | GET | `src/api/exams.ts:29` | Done |
| `/api/v1/teacher/exams/:id/subjects` | GET | `src/api/exams.ts:37` | Done |
| `/api/v1/teacher/exams/:id/marks` | GET | `src/api/exams.ts:45` | Done |
| `/api/v1/teacher/exams/:id/marks` | POST | `src/api/exams.ts:59` | Done |
| `/api/v1/teacher/exams/:id/publish` | POST | `src/api/exams.ts:81` | Done |

## React Query Hooks (`src/hooks/useExams.ts`)

| Hook | Query/Mutation | Cache Key | staleTime |
|---|---|---|---|
| `useExams` | `useQuery` | `['exams']` | 5 min |
| `useExamDetail` | `useQuery` | `['exams', examId]` | 5 min |
| `useExamSchedule` | `useQuery` | `['exams', examId, 'schedule']` | 5 min |
| `useMarks` | `useQuery` | `['exams', examId, 'marks', classId, subjectId]` | 2 min |
| `useSaveMarks` | `useMutation` | invalidates marks + exam detail | — |
| `usePublishResults` | `useMutation` | invalidates exam detail | — |

## Marks Workflow

```
ExamList → ExamDetail → EnterMarks (select class/subject → FlatList of students)
                                                      ↓
                                            Save Draft / Submit Marks
                                                      ↓
                                            Validation: [0, maxMarks]
                                                      ↓
                                            onSuccess → invalidate cache → goBack
```

### Validation Rules
- Marks cannot be negative — inline error `"Cannot be negative"`
- Marks cannot exceed `entry.maxMarks` — inline error `"Max {maxMarks}"`
- At least one student must have marks entered before submission
- Save Draft allows partial entry; Submit marks is final
- Duplicate submission prevented by mutation pending state (button loading)

## Component Coverage

| Component | Location | Used In |
|---|---|---|
| `ExamStatusBadge` | `src/components/ExamStatusBadge.tsx` | `ExamCard` |
| `ExamCard` | `src/components/ExamCard.tsx` | `ExamsScreen` |
| `MarksEntryRow` | `src/components/MarksEntryRow.tsx` | `MarksEntryScreen` |
| `MarksSummaryCard` | `src/components/MarksSummaryCard.tsx` | `ExamDetailScreen` |
| `ExamHeader` | `src/components/ExamHeader.tsx` | `ExamDetailScreen` |
| `ExamEmptyState` | `src/components/ExamEmptyState.tsx` | `ExamsScreen` |

## Screens

| Screen | Route Name | Params | Features |
|---|---|---|---|
| `ExamsScreen` | `Exams` (from tab) | — | Summary cards (upcoming/completed/published/pending), FlatList of ExamCards, pull-to-refresh, skeletons |
| `ExamDetailScreen` | `ExamDetail` | `{ examId }` | ExamHeader, MarksSummaryCard (if published), exam info (duration/marks/results), actions: Enter Marks, View Schedule, Publish Results |
| `MarksEntryScreen` | `MarksEntry` | `{ examId }` | Stats bar (student count / entered count), FlatList with MarksEntryRow, Save Draft + Submit footer, validation, keyboard-avoiding |
| `ExamScheduleScreen` | `ExamSchedule` | `{ examId }` | Day-badged schedule cards with date, time, subject, max marks, pull-to-refresh |

## Navigation Updates

- `src/navigation/AppNavigator.tsx` — 3 new Stack.Screen entries: `ExamDetail`, `MarksEntry`, `ExamSchedule`
- `src/screens/index.ts` — 4 new barrel exports

## Type Definitions (`src/types/index.ts`)

| Interface | Fields |
|---|---|
| `ExamItem` | id, name, description, type, status, startDate, endDate, className, section, totalMarks, resultPublished, marksEntered, marksEntryStatus |
| `ExamDetail` | extends ExamItem + schedule[], resultSummary?, subjects[] |
| `ExamScheduleItem` | id, subject, className, section, date, startTime, endTime, maxMarks |
| `MarksEntry` | studentId, studentName, marks, maxMarks |
| `MarksPayload` | examId, classId, subjectId, marks: {studentId, marks}[], isDraft |

## Performance Notes
- `FlatList` with `keyExtractor` for student list in marks entry (not `ScrollView.map`)
- Local state (`marksMap`) for real-time marks input without re-fetching
- Debounced validation (on save, not per keystroke)
- React Query stale times prevent unnecessary API calls
- Screens use `isPending` on mutation to show loading state on save buttons

## Design System Compliance
- All screens use `AppHeader`, `ScreenContainer`, `AppButton` (3 variants)
- `AppCard` variant used for schedule cards and info sections
- Theme tokens: `colors`, `spacing`, `typography`, `radius` throughout
- Ionicons from `@expo/vector-icons` per UX-2 standard
- `theme.typography.weight` constants for font weights
