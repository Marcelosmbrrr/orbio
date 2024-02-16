<?php

namespace App\Http\Requests\Others\UserProfile\MyProfile;

use Illuminate\Foundation\Http\FormRequest;

class EditProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "basic" => ["required"],
            "documents" => ["required"],
            "address" => ["required"],
            "contact" => ["required"]
        ];
    }
}
