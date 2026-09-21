<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLostFoundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // policy handles ownership
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:180',
            'description' => 'sometimes|required|string|min:10|max:5000',
            'category_id' => 'sometimes|required|exists:lost_found_categories,id',
            'location_id' => 'sometimes|required|exists:locations,id',
            'date_occurred' => 'sometimes|required|date|before_or_equal:today',
            'identifying_info' => 'nullable|string|max:2000',
            'contact_preference' => 'sometimes|in:in_app,email,phone',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'department_id' => 'sometimes|nullable|exists:departments,id',
            'semester' => 'sometimes|nullable|integer|min:1|max:12',
        ];
    }
}