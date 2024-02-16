<?php

namespace App\Http\Requests\Modules\FlightPlans;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateFlightPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $uniqueRule = Rule::unique('flight_plans')->where(function ($query) {
            return $query->where('tenant_id', session("tenant_id"));
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
