# Teacher App — Backend Endpoints (Documents & Circulars)

Drop-in Laravel implementation for the two endpoints the mobile app needs.
The Laravel project itself is **not in this repo** — copy these files into it.

## Install (in your Laravel app)

```bash
# 1. Copy the controllers
cp backend/app/Http/Controllers/Api/V1/Teacher/DocumentController.php  app/Http/Controllers/Api/V1/Teacher/
cp backend/app/Http/Controllers/Api/V1/Teacher/CircularController.php  app/Http/Controllers/Api/V1/Teacher/

# 2. Append the routes inside your existing auth'd /api/v1/teacher group:
#    (see the header comment in backend/routes/teacher-documents-circulars.php)
```

## Assumed schema (adjust to your tables)

```sql
-- documents: id, school_id (nullable), title, file_name, file_path,
--            file_type, size, uploaded_at, timestamps
-- circulars: id, school_id (nullable), title, message/description,
--            attachment_path, sent_at, is_published, timestamps
```

If your tables differ (e.g. a `teacher_id` column, or files in S3), edit the
two controller queries — **keep the response field names exactly as-is**;
the app parses those keys directly.

## Contract (must match exactly)

| Field | Type | Notes |
|---|---|---|
| `id` | int | numeric, never string |
| `title` | string | fallback to file name |
| `file_name` | string | |
| `file_url` | string \| null | **absolute** URL |
| `file_type` | string | MIME |
| `size` | int | bytes, 0 if unknown |
| `uploaded_at` | string \| null | ISO-8601 |
| `message` | string | circular body |
| `sent_at` | string \| null | ISO-8601 |
| `attachment_url` | string \| null | **absolute** URL |

Rules:
- Empty results are `"data": []` — **never** `null` (the app's `?? []` guard
  covers it, but `[]` keeps the contract honest).
- All fields snake_case.
- Never return a relative URL — the app calls `Linking.openURL(file_url)`
  directly, so it must be absolute.

## Sample JSON

### GET /api/v1/teacher/documents → 200

```json
{
  "success": true,
  "message": "Documents fetched successfully",
  "data": [
    {
      "id": 12,
      "title": "Annual Exam Time Table",
      "file_name": "exam-timetable-2026.pdf",
      "file_url": "https://school-erp-production-e3a5.up.railway.app/storage/exam-timetable-2026.pdf",
      "file_type": "application/pdf",
      "size": 245760,
      "uploaded_at": "2026-08-01T09:30:00+00:00"
    }
  ]
}
```

### GET /api/v1/teacher/circulars → 200

```json
{
  "success": true,
  "message": "Circulars fetched successfully",
  "data": [
    {
      "id": 7,
      "title": "Diwali Holidays",
      "message": "School will remain closed from 28th October to 3rd November.",
      "sent_at": "2026-08-05T07:00:00+00:00",
      "attachment_url": null
    }
  ]
}
```

### Empty (never null)

```json
{ "success": true, "message": "Documents fetched successfully", "data": [] }
```

## Test with curl

```bash
TOKEN="<teacher bearer token from POST /api/v1/teacher/login>"
BASE="https://school-erp-production-e3a5.up.railway.app"

curl -H "Authorization: Bearer $TOKEN" "$BASE/api/v1/teacher/documents"
curl -H "Authorization: Bearer $TOKEN" "$BASE/api/v1/teacher/circulars"

# Expect HTTP 200 with the JSON above. 401 = token/guard issue; 404 = routes not registered.
```
