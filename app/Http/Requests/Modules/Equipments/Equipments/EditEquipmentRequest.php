<?php

namespace App\Http\Requests\Modules\Equipments\Equipments;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditEquipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $equipment_id = $this->route("equipment");

        $uniqueRule = Rule::unique('equipments')->where(function ($query) use ($equipment_id) {
            return $query->where('tenant_id', session("tenant_id"))->where("id", "!=", $equipment_id);
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
            "name.required" => "informe o nome do equipamento",
            "name.unique" => "Já existe um equipamento com esse nome",
            "manufacturer.required" => "informe o fabricante",
            "record_number.required" => "informe o número de registro",
            "serial_number.required" => "informe o número serial",
            "weight.required" => "informe o peso"
        ];
    }
}
