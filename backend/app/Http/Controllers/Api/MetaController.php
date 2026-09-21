<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ComplaintCategory;
use App\Models\Department;
use App\Models\Location;
use App\Models\LostFoundCategory;

class MetaController extends Controller
{
public function departments()
{
    return response()->json([
        'success' => true,
        'data' => Department::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'max_semesters']),
    ]);
}

    public function complaintCategories()
    {
        return response()->json([
            'success' => true,
            'data' => ComplaintCategory::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
        ]);
    }

    public function lostFoundCategories()
    {
        return response()->json([
            'success' => true,
            'data' => LostFoundCategory::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
        ]);
    }

    public function locations()
    {
        return response()->json([
            'success' => true,
            'data' => Location::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'building', 'type']),
        ]);
    }
}