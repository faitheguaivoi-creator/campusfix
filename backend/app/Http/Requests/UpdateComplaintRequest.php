<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComplaintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // authorization happens in the policy
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:180',
            'description' => 'sometimes|required|string|min:10|max:5000',
            'category_id' => 'sometimes|required|exists:complaint_categories,id',
            'location_id' => 'sometimes|required|exists:locations,id',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'department_id' => 'sometimes|nullable|exists:departments,id',
            'semester' => 'sometimes|nullable|integer|min:1|max:12',
        ];
    }
}