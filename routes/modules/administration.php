<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\Modules\Administration\Operations\AdministrationController;

Route::middleware(['auth.custom'])->group(function () {
    Route::apiResource("api/v1/modules/administration/tenants", AdministrationController::class);
});
