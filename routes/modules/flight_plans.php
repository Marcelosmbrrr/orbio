<?php

use Illuminate\Support\Facades\Route;
// Resource
use App\Http\Controllers\v1\Modules\FlightPlans\Operations\FlightPlansModuleController;
// Actions
use App\Http\Controllers\v1\Modules\FlightPlans\Operations\Actions\ExportFlightPlanController;
use App\Http\Controllers\v1\Modules\FlightPlans\Operations\Actions\OpenFlightPlanController;
use App\Http\Controllers\v1\Modules\FlightPlans\Operations\Actions\UpdateFlightPlanRouteController;

Route::middleware(['auth.custom'])->group(function () {
    Route::apiResource("api/v1/modules/flight-plans", FlightPlansModuleController::class);
    Route::get("api/v1/actions/flight-plans/{id}/export", ExportFlightPlanController::class);
    Route::get("api/v1/actions/flight-plans/{id}/map", OpenFlightPlanController::class);
    Route::patch("api/v1/actions/flight-plans/{id}/map", UpdateFlightPlanRouteController::class);
});
