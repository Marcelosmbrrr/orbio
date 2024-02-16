<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\v1\Modules\Administration\Page\AdministrationPageController;
use App\Http\Controllers\v1\Modules\PersonsRoles\Page\PersonsAndRolesPageController;
use App\Http\Controllers\v1\Modules\ServiceOrders\Page\ServiceOrdersPageController;
use App\Http\Controllers\v1\Modules\FlightPlans\Page\FlightPlansPageController;
use App\Http\Controllers\v1\Modules\Equipments\Page\EquipmentsPageController;

Route::get('/', function () {
    return redirect("/signin");
});

Route::middleware(['guest'])->group(function () {
    Route::inertia('signin', 'guest/SignIn')->name("signin");
    Route::inertia('forgot-password/{entity}', 'guest/ForgotPassword');
});

Route::middleware(['auth.custom'])->group(function () {
    // Admin pages
    Route::get('home/administration', [AdministrationPageController::class, 'page']);
    // Persons and Roles module pages
    Route::get('home/users', [PersonsAndRolesPageController::class, 'usersPage']);
    // Route::get('home/roles', [PersonsAndRolesPageController::class, 'rolesPage']);
    // Service orders module pages
    Route::get('home/service-orders', [ServiceOrdersPageController::class, 'serviceOrdersPage']);
    Route::get('home/service-orders/create', [ServiceOrdersPageController::class, 'createServiceOrderPage']);
    Route::get('home/service-orders/{id}/report/create', [ServiceOrdersPageController::class, 'createServiceOrderReportPage']);
    Route::get('home/service-orders/{id}/log/create', [ServiceOrdersPageController::class, 'createServiceOrderLogPage']);
    Route::view('home/log-image-generation', "log-image-generation");
    // Flight plan module pages
    Route::get('home/flight-plans', [FlightPlansPageController::class, 'flightPlansPage']);
    Route::get('home/map/{id?}', [FlightPlansPageController::class, 'mapPage']);
    // Equipments module pages
    Route::get('home/drones', [EquipmentsPageController::class, 'dronesPage']);
    Route::get('home/batteries', [EquipmentsPageController::class, 'batteriesPage']);
    Route::get('home/equipments', [EquipmentsPageController::class, 'equipmentsPage']);
    // User profile page
    Route::inertia('home/my-profile', 'home/user-profile/UserProfile');
});

// Authentication
require __DIR__ . '/authentication/authentication.php';
// Modules operations
require __DIR__ . '/modules/administration.php';
require __DIR__ . '/modules/persons_roles.php';
require __DIR__ . '/modules/flight_plans.php';
require __DIR__ . '/modules/service_orders.php';
require __DIR__ . '/modules/equipments.php';
// Common operations
require __DIR__ . '/common/common.php';
