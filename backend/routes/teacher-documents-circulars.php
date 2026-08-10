<?php

/*
|--------------------------------------------------------------------------
| Teacher App — Documents & Circulars routes
|--------------------------------------------------------------------------
|
| Append these routes to the existing routes/api.php (inside the existing
| '/api' prefix group). They follow the exact contract the mobile app
| expects: { success, message, data: [...] } with snake_case fields and
| numeric ids. Auth guard: the same one used by the other /teacher/*
| routes (Sanctum by default — adjust to match your other teacher routes).
|
| Example:
|   Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
|       Route::prefix('teacher')->group(function () {
|           // ... your existing teacher routes ...
|           require __DIR__ . '/teacher-documents-circulars.php';
|       });
|   });
|
*/

use App\Http\Controllers\Api\V1\Teacher\CircularController;
use App\Http\Controllers\Api\V1\Teacher\DocumentController;

// GET /api/v1/teacher/documents
Route::get('documents', [DocumentController::class, 'index']);

// GET /api/v1/teacher/circulars
Route::get('circulars', [CircularController::class, 'index']);
