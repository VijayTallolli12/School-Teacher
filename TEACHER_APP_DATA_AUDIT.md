# Teacher App Data Integration Audit

**Date:** 2026-06-24  
**Environment:** `http://192.168.1.3:8000`  
**Auth:** Bearer token (valid)

---

## 1. Verification Results

| Module | API Status | Data Binding | Type Mapping | UI Renders | Verdict |
|---|---|---|---|---|---|
| Dashboard | ✅ 200 | ✅ | ✅ | ✅ | WORKING |
| Homework | ✅ 200 | ✅ | ✅ | ✅ | WORKING |
| Exams (list/detail) | ✅ 200 | ✅ | ✅ | ✅ | WORKING |
| Notifications | ✅ 200 | ✅ | ✅ | ✅ | WORKING |
| Profile | ✅ 200 | ✅ | ✅ | ✅ | WORKING |
| Attendance | ✅ 200 | ✅ FIXED | ✅ FIXED | ✅ FIXED | **FIXED** |
| Students | ❌ 404 | N/A | N/A | N/A | BACKEND MISSING |
| Timetable | ❌ 404 | N/A | N/A | N/A | BACKEND MISSING |
| Leaves | ❌ 404 | N/A | N/A | N/A | BACKEND MISSING |
| Transport | ❌ 404 | N/A | N/A | N/A | BACKEND MISSING |

---

## 2. Working Modules

### 2.1 Dashboard
**Endpoint:** `GET /api/v1/teacher/dashboard` → **200**
```json
{
  "success": true,
  "data": {
    "teacher": { "full_name": "Aisha Khan", "photo_url": null },
    "today_classes": [],
    "my_attendance_today": { "status": "absent" },
    "pending_homework_count": 5,
    "upcoming_exams": [],
    "notifications": { "unread_count": 0 }
  }
}
```
**Mapping (`src/api/dashboard.ts`):**
| API Field | TS Field | Status |
|---|---|---|
| `teacher.full_name` | `teacherName` | ✅ |
| `today_classes.length` | `todaysClasses` | ✅ |
| `my_attendance_today.status === 'absent'` | `attendancePending` (1/0) | ✅ |
| `pending_homework_count` | `homeworkPending` | ✅ |
| `upcoming_exams.length` | `upcomingExams` | ✅ |
| `notifications.unread_count` | `notificationCount` | ✅ |
| `new Date()` | `date` | ✅ |

**Hook:** `useDashboard()` → `response.data` → `DashboardData` ✅

### 2.2 Homework
**Endpoint:** `GET /api/v1/teacher/homework` → **200**
```json
{
  "data": [
    {
      "id": 1,
      "title": "English Assignment",
      "subject": { "name": "English" },
      "class_section": { "class": "Class 1", "section": "Section A" },
      "assigned_date": "2026-06-15",
      "due_date": "2026-06-26",
      "status": "active"
    }
  ]
}
```
**Mapping (`src/api/homework.ts`):**
| API Field | TS Field | Status |
|---|---|---|
| `id` (number) | `id` (string via `String()`) | ✅ |
| `subject.name` | `subject` | ✅ |
| `class_section.class` | `class` | ✅ |
| `class_section.section` | `section` | ✅ |
| `due_date` | `dueDate` | ✅ |
| `assigned_date` | `createdAt` | ✅ |
| `status: "active"` | `"pending"` | ✅ |

**Verdict:** No issues found.

### 2.3 Exams
**Endpoint:** `GET /api/v1/teacher/exams` → **200**
```json
{
  "data": [{
    "id": 4,
    "exam_name": "Mid Term Exam",
    "subject": { "name": "Social Studies" },
    "class_section": { "class": "Class 1", "section": "Section A" },
    "maximum_marks": 100,
    "pass_marks": 40,
    "status": "completed",
    "is_published": true
  }]
}
```
**Mapping (`src/api/exams.ts`):**
| API Field | TS Field | Status |
|---|---|---|
| `id` → `String(id)` | `id: string` | ✅ |
| `exam_name` | `name` | ✅ |
| `subject.name` | `subject` | ✅ |
| `class_section.class` | `className` | ✅ |
| `class_section.section` | `section` | ✅ |
| `maximum_marks` | `totalMarks` | ✅ |
| `status` | `status` (type assertion) | ✅ |
| `is_published` | `resultPublished` | ✅ |

**Detail endpoint:** `GET /api/v1/teacher/exams/{id}` → **200**
```json
{
  "data": {
    "exam": { ... },
    "students": [{
      "student_id": 1,
      "full_name": "Arjun Verma",
      "roll_no": "1",
      "result": { "marks_obtained": 53, "grade": "C" }
    }],
    "total_students": 2,
    "results_submitted": 2
  }
}
```
**Mapping to `ExamDetail`:** `resultSummary` computed from students array, `marksEntryStatus` derived from `results_submitted` vs `total_students` ✅

**Broken sub-endpoints:**
| Endpoint | Status | Issue |
|---|---|---|
| `GET /api/v1/teacher/exams/{id}/schedule` | ❌ 404 | Not implemented |
| `GET /api/v1/teacher/exams/classes` | ❌ 500 | Server error |
| `GET /api/v1/teacher/exams/subjects` | ❌ 500 | Server error |
| `GET /api/v1/teacher/exams/{id}/students` | ❌ 404 | Not implemented |

### 2.4 Notifications
**Endpoint:** `GET /api/v1/teacher/notifications` → **200**
```json
{
  "data": { "unread_count": 0, "notifications": [] }
}
```
**Verdict:** No issues — empty data is expected. Hook correctly maps notification fields.

### 2.5 Profile
**Endpoint:** `GET /api/v1/teacher/profile` → **200**
```json
{
  "data": {
    "user": { "id": 3, "name": "Aisha Khan", "email": "aisha.khan@example.com", "phone": "502-707-5979" },
    "teacher": {
      "employee_id": "T-1001",
      "full_name": "Aisha Khan",
      "phone": "9876543210",
      "qualification": "M.Sc. Mathematics",
      "subjects": [{ "name": "English" }, { "name": "Mathematics" }],
      "class_sections": [{ "class": "Class 1", "section": "Section A", "is_class_teacher": true }]
    }
  }
}
```
**Mapping (`auth.ts:mapApiData`):**
| API Field | TS Field | Status |
|---|---|---|
| `user.id` → `String(id)` | `id` | ✅ |
| `user.name` | `name` | ✅ |
| `user.email` | `email` | ✅ |
| `teacher.employee_id` | `employeeId` | ✅ |
| `teacher.phone \|\| user.phone` | `phone` | ✅ |
| `teacher.class_sections` | `classTeacherAssignments` | ✅ |
| — | `department` | ⚠️ No API field maps here, shows '—' |
| — | `designation` | ⚠️ No API field maps here, shows '—' |
| `schoolId` param | `schoolId` | ✅ |

**Verdict:** Minor — `department` and `designation` always display '—' because neither the `user` nor `teacher` API object contains these fields. This is a data availability issue, not a mapping bug.

---

## 3. Fixed Module: Attendance

### 3.1 Classes
**Endpoint:** `GET /api/v1/teacher/attendance/classes` → **200** ✅
```json
{
  "data": {
    "classes": [{
      "id": 1,
      "class": "Class 1",
      "section": "Section A",
      "is_class_teacher": true,
      "subject_count": 2
    }]
  }
}
```
**Mapping in `attendance.ts:getClasses()`:** ⚠️ WAS BROKEN, NOW FIXED

`getClasses()` originally returned `response.data.data.classes` with raw `ApiClass` objects (with `c.class`, `c.section` fields), while the TypeScript `TeacherClass` expects `name`, `section`.

**Fix applied:** Mapped `c.class` → `name`, `c.section` → `section`, `String(c.id)` → `id`. ✅

### 3.2 Students (Attendance)
**Endpoint:** `GET /api/v1/teacher/attendance/students/{classId}` → **200** ✅
```json
{
  "data": {
    "class_section": { "class": "Class 1", "section": "Section A" },
    "students": [
      {
        "student_id": 1,
        "full_name": "Arjun Verma",
        "roll_no": "1",
        "photo_url": null,
        "attendance": null
      },
      {
        "student_id": 11,
        "full_name": "Ravi Desai",
        "roll_no": "11",
        "photo_url": null,
        "attendance": null
      }
    ]
  }
}
```
**Mapping in `attendance.ts:getStudents()`:** ⚠️ WAS BROKEN, NOW FIXED

**Original bug:** `getStudents()` returned raw API data without mapping. The API uses `student_id`, `full_name`, `roll_no` but the `AttendanceStudent` interface expects `id`, `name`, `rollNumber`.

**Root cause:** No property mapping between API snake_case and TypeScript camelCase. All fields were `undefined`:
- `student.id` = `undefined` (API has `student_id`)
- `student.name` = `undefined` (API has `full_name`)
- `student.rollNumber` = `undefined` (API has `roll_no`)
- `student.class` = `undefined` (at `data.class_section.class`, not in student object)
- `student.section` = `undefined` (at `data.class_section.section`, not in student object)

**Symptoms:**
1. Student cards rendered with empty names (`student.name` → blank)
2. Roll numbers showed "Roll: " with no value (`student.rollNumber` → undefined)
3. **State management bug:** All students stored under `attendanceMap[undefined]` because `student.id` → `undefined` for every student. Clicking Present/Absent on any single card updated ALL cards simultaneously.

**Fix applied (`attendance.ts:36-63`):**
```typescript
const mapped: AttendanceStudent[] = apiStudents.map((s) => ({
  id: String(s.student_id),
  name: s.full_name,
  rollNumber: s.roll_no,
  class: response.data.data.class_section.class,
  section: response.data.data.class_section.section,
}));
```

### 3.3 Mark Attendance
**Endpoint:** `POST /api/v1/teacher/attendance/mark` → **Untested (known POST redirect issue)**

---

## 4. Broken Modules (Backend Routes Not Implemented)

### 4.1 Students
| Endpoint | Status | Used By |
|---|---|---|
| `GET /api/v1/teacher/students` | ❌ 404 | `StudentsScreen.tsx` |
| `GET /api/v1/teacher/students/{id}` | ❌ 404 | `StudentDetailScreen.tsx` |
| `GET /api/v1/teacher/students/{id}/attendance` | ❌ 404 | `StudentDetailScreen.tsx` |
| `GET /api/v1/teacher/students/{id}/profile` | ❌ 404 | `students.ts` (unused) |

**Frontend impact:** StudentsScreen shows error state with "Something went wrong". StudentDetailScreen not reachable.

### 4.2 Timetable
| Endpoint | Status | Used By |
|---|---|---|
| `GET /api/v1/teacher/timetable/today` | ❌ 404 | `TimetableScreen.tsx` |
| `GET /api/v1/teacher/timetable/week` | ❌ 404 | `TimetableScreen.tsx` |
| `GET /api/v1/teacher/timetable/periods/{id}` | ❌ 404 | `PeriodDetailScreen.tsx` |

**Frontend impact:** TimetableScreen shows error state with defensive guards added (previous fix). PeriodDetailScreen not reachable.

### 4.3 Leaves
| Endpoint | Status | Used By |
|---|---|---|
| `GET /api/v1/teacher/leaves` | ❌ 404 | `LeaveScreen.tsx` |
| `GET /api/v1/teacher/leaves/balance` | ❌ 404 | `LeaveScreen.tsx` |
| `GET /api/v1/teacher/leaves/types` | ❌ 404 | `LeaveScreen.tsx` (apply form) |
| `GET /api/v1/teacher/leaves/{id}` | ❌ 404 | `LeaveDetailScreen.tsx` |
| `POST /api/v1/teacher/leaves` | ❌ 404 | Apply leave |
| `POST /api/v1/teacher/leaves/{id}/cancel` | ❌ 404 | Cancel leave |

### 4.4 Transport
| Endpoint | Status | Used By |
|---|---|---|
| `GET /api/v1/teacher/transport/routes` | ❌ 404 | `TransportScreen.tsx` |
| `GET /api/v1/teacher/transport/vehicles` | ❌ 404 | `TransportScreen.tsx` |
| `GET /api/v1/teacher/transport/vehicles/{id}/location` | ❌ 404 | Map tracking |
| `GET /api/v1/teacher/transport/live-status` | ❌ 404 | `TransportScreen.tsx` |
| `GET /api/v1/teacher/transport/routes/{id}` | ❌ 404 | `RouteDetailScreen.tsx` |

### 4.5 Exams (Sub-endpoints)
| Endpoint | Status | Used By |
|---|---|---|
| `GET /api/v1/teacher/exams/{id}/schedule` | ❌ 404 | `ExamScheduleScreen.tsx` |
| `GET /api/v1/teacher/exams/classes` | ❌ 500 | Exam mark entry |
| `GET /api/v1/teacher/exams/subjects` | ❌ 500 | Exam mark entry |
| `GET /api/v1/teacher/exams/{id}/students` | ❌ 404 | Exam detail |

---

## 5. State Management Bugs

| Module | Bug | Root Cause | Fix Applied |
|---|---|---|---|
| Attendance | Clicking status on one student selects ALL students | `student.id` = `undefined` for all — all stored under `attendanceMap[undefined]` | ✅ `getStudents()` now maps `student_id` → `id` properly, giving each student a unique key |
| Timetable | "Cannot read property 'periods' of undefined" | `todayData.day` undefined when API returns 404 — code accessed `todayData.day.periods` without optional chaining | ✅ Added `!todayData.day` guard at `TimetableScreen.tsx:117` |

---

## 6. API Field Name Mismatches

### Consistent Pattern Across All Working Endpoints
The API uses **snake_case** for all field names. Some TypeScript interfaces use **camelCase**.

| API Field | Found In | Expected TS Field | Mapped? |
|---|---|---|---|
| `student_id` | Attendance students, Exam detail students | `id` | ✅ FIXED |
| `full_name` | Attendance students, Exam detail students, Teacher object | `name` | ✅ FIXED |
| `roll_no` | Attendance students, Exam detail students | `rollNumber` | ✅ FIXED |
| `exam_name` | Exam item | `name` | ✅ Yes |
| `maximum_marks` | Exam item | `totalMarks` | ✅ Yes |
| `pass_marks` | Exam item | (not stored) | ✅ Ignored |
| `due_date` | Homework | `dueDate` | ✅ Yes |
| `assigned_date` | Homework | `createdAt` | ✅ Yes |
| `employee_id` | Teacher profile | `employeeId` | ✅ Yes |
| `is_published` | Exam | `resultPublished` | ✅ Yes |
| `admission_no` | Attendance student API | (not in `AttendanceStudent`) | ✅ Ignored |

### Missing Fields in TypeScript Interfaces
| Field | Available In API | In Interface? | Used In UI? |
|---|---|---|---|
| `admission_no` | Attendance student, exam student | No (`AttendanceStudent` lacks it) | Not displayed |
| `photo_url` / `avatar_url` | Teacher, Student | Yes (`photo?` on StudentItem) | Not displayed |
| `uuid` | Student records | No | Not displayed |
| `attendance` (per-student status) | Attendance student object | No | Not displayed (used separately) |

---

## 7. Fixes Applied During Audit

| File | Change | Issue |
|---|---|---|
| `src/api/attendance.ts:36-63` | `getStudents()` now maps `student_id`→`id`, `full_name`→`name`, `roll_no`→`rollNumber`, reads `class`/`section` from parent `class_section` object | Student names/rolls missing, state management broken |
| `src/screens/AttendanceScreen.tsx:226` | Added `key={student.id ?? `student-${index}`}` fallback key | React key warning when `id` undefined |
| `src/screens/TimetableScreen.tsx:117` | Added `!todayData.day` && `!todayData.day.periods` checks | Crash accessing `periods` on undefined |

---

## 8. Recommendations

### High Priority
1. **Backend: Implement missing routes** — Students, Timetable, Leaves, Transport modules are entirely non-functional due to 404 endpoints.
2. **Backend: Fix Exam sub-endpoints** — `exams/classes` and `exams/subjects` return 500; `exams/{id}/schedule` returns 404.
3. **Backend: Fix POST authentication** — POST requests redirect to login page; token-based auth should accept POST.

### Low Priority
4. **Frontend: Add `department`/`designation` fallback** — Profile screen shows '—' for these; either remove or add to API.
5. **Frontend: Add `admissionNo` to `AttendanceStudent`** — Available from API but not exposed in the attendance card UI.
