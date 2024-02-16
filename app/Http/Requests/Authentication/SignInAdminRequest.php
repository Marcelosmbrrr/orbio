<?php

namespace App\Http\Requests\Authentication;

use Illuminate\Foundation\Http\FormRequest;

class SignInAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "login" => ["required", "email", "exists:admins,email"],
            "password" => ["required"]
        ];
    }

    public function messages()
    {
        return [
            "login.required" => "informe o e-mail",
            "login.email" => "e-mail inválido",
            "login.exists" => "e-mail não encontrado",
            "password.required" => "informe a senha"
        ];
    }
}
