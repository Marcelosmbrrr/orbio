<?php

namespace App\Http\Requests\Modules\Administration;

use Illuminate\Foundation\Http\FormRequest;

class EditTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user_id = $this->route("user");

        return [
            "name" => ["required"],
            "email" => ["required", "email", "unique:tenants,email," . $user_id],
            "enable" => ["sometimes"]
        ];
    }

    public function messages()
    {
        return [
            "name.required" => "informe o nome",
            "email.email" => "e-mail inválido",
            "email.unique" => "e-mail já existe"
        ];
    }
}
