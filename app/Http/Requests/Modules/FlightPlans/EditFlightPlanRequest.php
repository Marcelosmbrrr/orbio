<?php

namespace App\Http\Requests\Modules\FlightPlans;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EditFlightPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $flight_plan_id = $this->route("flight_plan");

        $uniqueRule = Rule::unique('users')->where(function ($query)  use ($flight_plan_id) {
            return $query->where('tenant_id', session("tenant_id"))->where("id", "!=", $flight_plan_id);
        });

        return [
            "name" => ["required", $uniqueRule]
        ];
    }

    public function messages()
    {
        return [
            "name.unique" => "Esse nome já foi utilizado"
        ];
    }
}
