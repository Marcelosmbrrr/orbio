<?php

namespace App\Http\Requests\Modules\ServiceOrders\Logs;

use Illuminate\Foundation\Http\FormRequest;

class CreateLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }
}
