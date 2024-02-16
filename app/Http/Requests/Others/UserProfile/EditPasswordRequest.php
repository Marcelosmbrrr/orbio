<?php

namespace App\Http\Requests\Others\UserProfile;

use Illuminate\Foundation\Http\FormRequest;

class EditPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "actual_password" => ["required"],
            "password" => ["required", "confirmed"]
        ];
    }

    public function messages()
    {
        return [
            "actual_password.required" => "O campo senha atual é obrigatório.",
            "password.required" => "O campo senha é obrigatório.",
            "password.min" => "O campo senha deve ter no mínimo 8 caracteres.",
            "password.confirmed" => "O campo senha não confere com o campo confirmação de senha."
        ];
    }
}
