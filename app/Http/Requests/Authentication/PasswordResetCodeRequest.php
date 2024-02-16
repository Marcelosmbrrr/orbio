<?php

namespace App\Http\Requests\Authentication;

use Illuminate\Foundation\Http\FormRequest;

class PasswordResetCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "email" => ["required", "email"]
        ];
    }

    public function messages()
    {
        return [
            "email.required" => "informe o e-mail",
            "email.email" => "e-mail inválido",
            "email.exists" => "informe a senha",
            "email.exists" => "e-mail não encontrado"
        ];
    }
}
