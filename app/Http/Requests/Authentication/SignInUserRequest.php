<?php

namespace App\Http\Requests\Authentication;

use Illuminate\Foundation\Http\FormRequest;

class SignInUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "login" => ["required", "exists:users,login"],
            "password" => ["required"]
        ];
    }

    public function messages()
    {
        return [
            "login.required" => "informe o ID da conta",
            "login.exists" => "ID não encontrado",
            "password.required" => "informe a senha"
        ];
    }
}
