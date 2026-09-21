<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // any authenticated user may submit
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:180',
            'description' => 'required|string|min:10|max:5000',
            'category_id' => 'required|exists:complaint_categories,id',
            'location_id' => 'required|exists:locations,id',
            'priority' => 'required|in:low,medium,high,urgent',
            'is_anonymous' => 'sometimes|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'department_id' => 'nullable|exists:departments,id',
            'semester' => 'nullable|integer|min:1|max:12',
        ];
    }
}