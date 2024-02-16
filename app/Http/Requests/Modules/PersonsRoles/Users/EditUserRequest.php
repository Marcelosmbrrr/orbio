<?php

namespace App\Http\Requests\Modules\PersonsRoles\Users;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user_id = $this->route("user");

        $uniqueRule = Rule::unique('users', 'email')->where(function ($query)  use ($user_id) {
            return $query->where('tenant_id', session("tenant_id"))->where("id", "!=", $user_id);
        });

        return [
            "name" => ["required"],
            "email" => ["required", "email", $uniqueRule],
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
