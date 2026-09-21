<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\LostFoundCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LostFoundCategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => LostFoundCategory::withCount('items')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:80|unique:lost_found_categories,name',
            'description' => 'nullable|string|max:255',
        ]);

        $category = LostFoundCategory::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created.',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, LostFoundCategory $lostFoundCategory)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:80|unique:lost_found_categories,name,' . $lostFoundCategory->id,
            'description' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $lostFoundCategory->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category updated.',
            'data' => $lostFoundCategory->fresh(),
        ]);
    }

    public function destroy(LostFoundCategory $lostFoundCategory)
    {
        if ($lostFoundCategory->items()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete — items still reference this category. Disable it instead.',
            ], 409);
        }

        $lostFoundCategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted.',
        ]);
    }
}