<?php

namespace App\Http\Requests\Modules\PersonsRoles\Roles;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $role_id = $this->route("role");

        $uniqueRule = Rule::unique('users')->where(function ($query)  use ($role_id) {
            return $query->where('tenant_id', session("tenant_id"))->where("id", "!=", $role_id);
        });

        return [
            "name" => ["required", $uniqueRule],
            "profile_data" => ["required"],
            "modules" => ["required"],
            "enable" => ["sometimes"]
        ];
    }

    public function messages()
    {
        return [
            "name.required" => "informe o nome",
            "profile_data.required" => "selecione os dados do cargo",
            "modules.unique" => "selecione os poderes do cargo"
        ];
    }
}
