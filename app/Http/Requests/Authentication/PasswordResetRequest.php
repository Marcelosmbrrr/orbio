<?php

namespace App\Http\Requests\Authentication;

use Illuminate\Foundation\Http\FormRequest;

class PasswordResetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "code" => ["required", "exists:password_reset_tokens,token"],
            "password" => ["required", "confirmed"]
        ];
    }

    public function messages()
    {
        return [
            "code.required" => "informe o código recebido",
            "code.exists" => "código não encontrado",
            "password.required" => "informe a senha",
            "password.confirmed" => "senhas incompatíveis"
        ];
    }
}
