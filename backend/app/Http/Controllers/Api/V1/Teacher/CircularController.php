<?php

namespace App\Http\Controllers\Api\V1\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Circular;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Teacher Circulars API.
 *
 * Contract (matches src/api/circulars.ts + src/types/index.ts):
 *   GET /api/v1/teacher/circulars
 *   200 → { "success": true, "message": "...", "data": [ { id, title,
 *           message, sent_at, attachment_url } ] }
 *
 * Rules:
 *   - ids are ALWAYS numeric ints (never strings)
 *   - attachment_url is a full absolute URL or null
 *   - empty result is `data: []`, never `data: null`
 *   - sent_at is ISO-8601 or null
 */
class CircularController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Assumes a `circulars` table with school scoping. Adjust to match
        // your schema if circulars are published school-wide only.
        $circulars = Circular::query()
            ->when($user, fn ($q) => $q->where(function ($w) use ($user) {
                $w->where('school_id', $user->school_id)
                    ->orWhereNull('school_id');
            }))
            ->where('is_published', true)
            ->orderByDesc('sent_at')
            ->limit(500)
            ->get();

        $data = $circulars->map(fn (Circular $circular) => [
            'id'             => (int) $circular->id,
            'title'          => $circular->title ?? 'Circular',
            'message'        => $circular->message ?? $circular->description ?? '',
            'sent_at'        => optional($circular->sent_at)->toIso8601String(),
            'attachment_url' => $circular->attachment_path
                ? asset('storage/' . ltrim($circular->attachment_path, '/'))
                : null,
        ])->values();

        return response()->json([
            'success' => true,
            'message' => 'Circulars fetched successfully',
            'data'    => $data,
        ]);
    }
}
