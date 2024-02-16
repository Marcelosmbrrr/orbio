<?php

namespace App\Http\Requests\Modules\ServiceOrders\Reports;

use Illuminate\Foundation\Http\FormRequest;

class EditReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            //
        ];
    }
}
