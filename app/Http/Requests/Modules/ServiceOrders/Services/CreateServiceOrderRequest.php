<?php

namespace App\Http\Requests\Modules\ServiceOrders\Services;

use Illuminate\Foundation\Http\FormRequest;

class CreateServiceOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "client" => ["sometimes", "array", "max:1"],
            "pilot" => ["sometimes", "array", "max:1"],
            "flight_plans" => ["sometimes", "array", "min:1"],
            "drones" => ["sometimes", "array"],
            "batteries" => ["sometimes", "array"],
            "equipments" => ["sometimes", "array"],
        ];
    }

    public function messages(): array
    {
        return [
            "client.array" => "O campo cliente deve ser um array.",
            "client.max" => "O cliente já foi selecionado",
            "pilot.array" => "O campo piloto deve ser um array.",
            "pilot.max" => "O piloto já foi selecionado",
            "flight_plans.array" => "O campo planos de voo deve ser um array",
            "flight_plans.min" => "Selecione pelo menos um plano de voo",
            "drones.array" => "O campo drones deve ser um array",
            "batteries.array" => "O campo baterias deve ser um array",
            "equipments.array" => "O campo equipamentos deve ser um array",
        ];
    }
}
