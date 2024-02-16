<?php

namespace App\Http\Requests\Modules\Equipments\Drones;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditDroneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $drone_id = $this->route("drone");

        $uniqueRule = Rule::unique('drones')->where(function ($query) use ($drone_id) {
            return $query->where('tenant_id', session("tenant_id"))->where("id", "!=", $drone_id);
        });

        return [
            "name" => ["required", $uniqueRule],
            "manufacturer" => ["required"],
            "model" => ["required"],
            "record_number" => ["required"],
            "serial_number" => ["required"],
            "weight" => ["required"],
            "image" => ["sometimes"],
            "enable" => ["sometimes"]
        ];
    }

    public function messages()
    {
        return [
            "name.required" => "informe o nome do drone",
            "name.unique" => "Já existe um drone com esse nome",
            "model.required" => "informe o modelo",
            "manufacturer.required" => "informe o fabricante",
            "record_number.required" => "informe o número de registro",
            "serial_number.required" => "informe o número serial",
            "weight.required" => "informe o peso"
        ];
    }
}
