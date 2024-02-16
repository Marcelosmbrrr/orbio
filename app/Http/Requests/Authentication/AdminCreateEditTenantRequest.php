<?php

namespace App\Http\Requests\Modules\PersonsRoles;

use Illuminate\Foundation\Http\FormRequest;

class AdminCreateEditTenantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user_id = $this->route("user") ? "," . $this->route("user") : "";

        return [
            "name" => ["required"],
            "email" => ["required", "email", "unique:tenants,email" . $user_id],
            "role_id" => ["required", "not_in:none"],
            "enable" => ["sometimes"]
        ];
    }

    public function messages()
    {
        return [
            "name.required" => "informe o nome",
            "email.email" => "e-mail inválido",
            "email.unique" => "e-mail já existe",
            "role_id.required" => "selecione o cargo",
            "role_id.not_in" => "selecione o cargo"
        ];
    }
}
