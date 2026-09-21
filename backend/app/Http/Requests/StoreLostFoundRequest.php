<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLostFoundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:lost,found',
            'title' => 'required|string|max:180',
            'description' => 'required|string|min:10|max:5000',
            'category_id' => 'required|exists:lost_found_categories,id',
            'location_id' => 'required|exists:locations,id',
            'date_occurred' => 'required|date|before_or_equal:today',
            'identifying_info' => 'nullable|string|max:2000',
            'contact_preference' => 'sometimes|in:in_app,email,phone',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'department_id' => 'nullable|exists:departments,id',
            'semester' => 'nullable|integer|min:1|max:12',
        ];
    }
}