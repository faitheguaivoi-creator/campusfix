<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateComplaintStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return in_array($this->user()->role, ['admin', 'staff'], true);
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:submitted,under_review,assigned,in_progress,resolved,closed',
            'message' => 'nullable|string|max:2000',
        ];
    }
}