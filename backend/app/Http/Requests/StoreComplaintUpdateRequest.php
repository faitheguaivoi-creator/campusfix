<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComplaintUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // ownership enforced in controller/policy
    }

    public function rules(): array
    {
        return [
            'message' => 'required|string|min:2|max:2000',
            'status' => 'nullable|in:submitted,under_review,assigned,in_progress,resolved,closed',
        ];
    }
}