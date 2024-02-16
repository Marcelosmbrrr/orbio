<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\Modules\PersonsRoles\Operations\UsersTenantController;
use App\Http\Controllers\v1\Modules\PersonsRoles\Operations\RolesTenantController;

Route::middleware(['auth.custom'])->group(function () {
    Route::apiResource("api/v1/modules/persons-roles/users", UsersTenantController::class);
    Route::apiResource("api/v1/modules/persons-roles/roles", RolesTenantController::class);
});
