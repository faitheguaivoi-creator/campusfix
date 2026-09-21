<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Location::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'building' => 'nullable|string|max:100',
            'type' => 'required|in:academic,hostel,administrative,library,sports,cafeteria,other',
        ]);

        $location = Location::create([...$validated, 'is_active' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Location created.',
            'data' => $location,
        ], 201);
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'building' => 'nullable|string|max:100',
            'type' => 'sometimes|required|in:academic,hostel,administrative,library,sports,cafeteria,other',
            'is_active' => 'sometimes|boolean',
        ]);

        $location->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Location updated.',
            'data' => $location->fresh(),
        ]);
    }

    public function destroy(Location $location)
    {
        try {
            $location->delete();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'This location cannot be deleted because it is in use.',
            ], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Location deleted.',
        ]);
    }
}