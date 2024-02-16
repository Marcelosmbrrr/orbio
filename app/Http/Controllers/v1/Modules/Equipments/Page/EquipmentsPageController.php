<?php

namespace App\Http\Controllers\v1\Modules\Equipments\Page;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EquipmentsPageController extends Controller
{
    function dronesPage()
    {
        Gate::authorize('ge:read');
        return Inertia::render("home/equipments/drones/Drones");
    }

    function batteriesPage()
    {
        Gate::authorize('ge:read');
        return Inertia::render("home/equipments/batteries/Batteries");
    }

    function equipmentsPage()
    {
        Gate::authorize('ge:read');
        return Inertia::render("home/equipments/others/OtherEquipments");
    }
}
