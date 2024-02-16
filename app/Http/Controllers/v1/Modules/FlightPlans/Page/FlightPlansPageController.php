<?php

namespace App\Http\Controllers\v1\Modules\FlightPlans\Page;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FlightPlansPageController extends Controller
{
    public function flightPlansPage()
    {
        Gate::authorize('gpv:read');
        return Inertia::render("home/flight-plans/FlightPlans");
    }

    public function mapPage()
    {
        Gate::authorize('gpv:read');
        return view("map");
    }
}
