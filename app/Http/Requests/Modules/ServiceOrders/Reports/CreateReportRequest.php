<?php

namespace App\Http\Requests\Modules\ServiceOrders\Reports;

use Illuminate\Foundation\Http\FormRequest;

class CreateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => "required|string",
        ];
    }

    public function messages(): array
    {
        return [
            "name.required" => "O campo nome é obrigatório.",
            "name.string" => "O campo nome deve ser uma string."
        ];
    }
}
