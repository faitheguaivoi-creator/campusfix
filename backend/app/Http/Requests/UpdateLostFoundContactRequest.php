<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLostFoundContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // policy handles receiver/admin check
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:accepted,declined,resolved',
        ];
    }
}