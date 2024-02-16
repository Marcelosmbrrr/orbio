<?php

namespace App\Http\Requests\Modules\Equipments\Batteries;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditBatteryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $battery_id = $this->route("battery");

        $uniqueRule = Rule::unique('batteries')->where(function ($query) use ($battery_id) {
            return $query->where('tenant_id', session("tenant_id"))->where("id", "!=", $battery_id);
        });

        return [
            "name" => ["required", $uniqueRule],
            "manufacturer" => ["required"],
            "model" => ["required"],
            "serial_number" => ["required"],
            "last_charge" => ["required"],
            "image" => ["sometimes"],
            "enable" => ["sometimes"]
        ];
    }

    public function messages()
    {
        return [
            "name.required" => "informe o nome da bateria",
            "name.unique" => "Já existe uma bateria com esse nome",
            "manufacturer.required" => "informe o fabricante",
            "serial_number.required" => "informe o número serial",
            "last_charge.required" => "informe a data da última carga"
        ];
    }
}
