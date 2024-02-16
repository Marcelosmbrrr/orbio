<?php

use Illuminate\Support\Facades\Route;
// Resource
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\ServiceOrdersModuleController;
// Actions
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderFlightPlanController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderDroneController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderBatteryController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderEquipmentController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderClientController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderPilotController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderIncidentController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderReportController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderStatusController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderLogsController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions\ServiceOrderLogUploadController;

Route::middleware(['auth.custom'])->group(function () {
    Route::apiResource("api/v1/modules/service-orders", ServiceOrdersModuleController::class);
    // clients
    Route::get("api/v1/actions/service-orders/clients", [ServiceOrderClientController::class, "index"]);
    Route::post("api/v1/actions/service-orders/{service_order_id}/clients/add", [ServiceOrderClientController::class, "store"]);
    Route::delete("api/v1/actions/service-orders/{service_order_id}/clients/{client_id}/delete", [ServiceOrderClientController::class, "delete"]);
    // pilots
    Route::get("api/v1/actions/service-orders/pilots", [ServiceOrderPilotController::class, "index"]);
    Route::post("api/v1/actions/service-orders/{service_order_id}/pilots/add", [ServiceOrderPilotController::class, "store"]);
    Route::delete("api/v1/actions/service-orders/{service_order_id}/pilots/{pilot_id}/delete", [ServiceOrderPilotController::class, "delete"]);
    // flight plans
    Route::get("api/v1/actions/service-orders/flight-plans", [ServiceOrderFlightPlanController::class, "index"]);
    Route::post("api/v1/actions/service-orders/{service_order_id}/flight-plans/add", [ServiceOrderFlightPlanController::class, "store"]);
    Route::delete("api/v1/actions/service-orders/{service_order_id}/flight-plans/{flight_plan_id}/delete", [ServiceOrderFlightPlanController::class, "delete"]);
    // drones
    Route::get("api/v1/actions/service-orders/drones", [ServiceOrderDroneController::class, "index"]);
    Route::post("api/v1/actions/service-orders/{service_order_id}/drones/add", [ServiceOrderDroneController::class, "store"]);
    Route::delete("api/v1/actions/service-orders/{service_order_id}/drones/{drone_id}/delete", [ServiceOrderDroneController::class, "delete"]);
    // batteries
    Route::get("api/v1/actions/service-orders/batteries", [ServiceOrderBatteryController::class, "index"]);
    Route::post("api/v1/actions/service-orders/{service_order_id}/batteries/add", [ServiceOrderBatteryController::class, "store"]);
    Route::delete("api/v1/actions/service-orders/{service_order_id}/batteries/{battery_id}/delete", [ServiceOrderBatteryController::class, "delete"]);
    // equipments
    Route::get("api/v1/actions/service-orders/equipments", [ServiceOrderEquipmentController::class, "index"]);
    Route::post("api/v1/actions/service-orders/{service_order_id}/equipments/add", [ServiceOrderEquipmentController::class, "store"]);
    Route::delete("api/v1/actions/service-orders/{service_order_id}/equipments/{equipment_id}/delete", [ServiceOrderEquipmentController::class, "delete"]);
    // logs
    Route::post("api/v1/actions/service-orders/{service_order_id}/logs", [ServiceOrderLogsController::class, "store"]);
    Route::delete("api/v1/actions/service-orders/{service_order_id}/logs/{log_id}/delete", [ServiceOrderLogsController::class, "delete"]);
    Route::get("api/v1/actions/service-orders/{service_order_id}/logs/{log_id}/export", [ServiceOrderLogsController::class, "export"]);
    Route::post("api/v1/actions/service-orders/logs/upload/processing", ServiceOrderLogUploadController::class);
    // incidents
    Route::apiResource("api/v1/actions/service-orders/{service_order_id}/incidents", ServiceOrderIncidentController::class);
    // reports
    Route::get("api/v1/actions/service-orders/{service_order_id}/report", [ServiceOrderReportController::class, "index"]);
    Route::get("api/v1/actions/service-orders/{service_order_id}/report/export", [ServiceOrderReportController::class, "export"]);
    Route::post("api/v1/actions/service-orders/{service_order_id}/report/create", [ServiceOrderReportController::class, "store"]);
    Route::delete("api/v1/actions/service-orders/{service_order_id}/report/{report_id}/delete", [ServiceOrderReportController::class, "delete"]);
    // Status
    Route::patch("api/v1/actions/service-orders/{service_order_id}/change-status", ServiceOrderStatusController::class);
});
