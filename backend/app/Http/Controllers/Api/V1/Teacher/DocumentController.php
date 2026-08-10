<?php

namespace App\Http\Controllers\Api\V1\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Teacher Documents API.
 *
 * Contract (matches src/api/documents.ts + src/types/index.ts):
 *   GET /api/v1/teacher/documents
 *   200 → { "success": true, "message": "...", "data": [ { id, title,
 *           file_name, file_url, file_type, size, uploaded_at } ] }
 *
 * Rules:
 *   - ids are ALWAYS numeric ints (never strings)
 *   - file_url is a full absolute URL or null (never a relative path)
 *   - size is bytes (int, 0 when unknown)
 *   - empty result is `data: []`, never `data: null`
 *   - uploaded_at is ISO-8601 or null
 */
class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Assumes a `documents` table with school scoping. Adjust the query
        // to match your schema (e.g. `teacher_id` column or a pivot).
        $documents = Document::query()
            ->when($user, fn ($q) => $q->where(function ($w) use ($user) {
                $w->where('school_id', $user->school_id)
                    ->orWhereNull('school_id'); // school-wide documents
            }))
            ->orderByDesc('uploaded_at')
            ->limit(500) // safety cap for very large libraries
            ->get();

        $data = $documents->map(fn (Document $doc) => [
            'id'          => (int) $doc->id,
            'title'       => $doc->title ?? $doc->file_name ?? 'Untitled document',
            'file_name'   => $doc->file_name ?? $doc->title ?? 'document',
            'file_url'    => $doc->file_path ? asset('storage/' . ltrim($doc->file_path, '/')) : null,
            'file_type'   => $doc->file_type ?? $this->guessType($doc->file_name),
            'size'        => (int) ($doc->size ?? 0),
            'uploaded_at' => optional($doc->uploaded_at)->toIso8601String(),
        ])->values();

        return response()->json([
            'success' => true,
            'message' => 'Documents fetched successfully',
            'data'    => $data,
        ]);
    }

    private function guessType(?string $fileName): string
    {
        $ext = strtolower(pathinfo((string) $fileName, PATHINFO_EXTENSION));
        return match ($ext) {
            'pdf' => 'application/pdf',
            'png', 'jpg', 'jpeg', 'gif', 'webp' => 'image/' . $ext,
            'doc', 'docx' => 'application/msword',
            'xls', 'xlsx' => 'application/vnd.ms-excel',
            'zip' => 'application/zip',
            default => 'application/octet-stream',
        };
    }
}
