<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ComplaintCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ComplaintCategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => ComplaintCategory::withCount('complaints')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:80|unique:complaint_categories,name',
            'description' => 'nullable|string|max:255',
        ]);

        $category = ComplaintCategory::create([
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

    public function update(Request $request, ComplaintCategory $complaintCategory)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:80|unique:complaint_categories,name,' . $complaintCategory->id,
            'description' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $complaintCategory->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Category updated.',
            'data' => $complaintCategory->fresh(),
        ]);
    }

    public function destroy(ComplaintCategory $complaintCategory)
    {
        if ($complaintCategory->complaints()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete — complaints still reference this category. Disable it instead.',
            ], 409);
        }

        $complaintCategory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted.',
        ]);
    }
}