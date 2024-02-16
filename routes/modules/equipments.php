<?php

use Illuminate\Support\Facades\Route;
// Resource
use App\Http\Controllers\v1\Modules\Equipments\Operations\Drones\DronesModuleController;
use App\Http\Controllers\v1\Modules\Equipments\Operations\Batteries\BatteriesModuleController;
use App\Http\Controllers\v1\Modules\Equipments\Operations\Equipments\EquipmentsModuleController;

Route::middleware(['auth.custom'])->group(function () {
    Route::apiResource("api/v1/modules/drones", DronesModuleController::class);
    Route::apiResource("api/v1/modules/batteries", BatteriesModuleController::class);
    Route::apiResource("api/v1/modules/equipments", EquipmentsModuleController::class);
});
