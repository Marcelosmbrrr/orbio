<?php

namespace App\Http\Controllers\v1\Modules\Administration\Page;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AdministrationPageController extends Controller
{
    function page()
    {
        Gate::authorize('gadmin:read');
        return Inertia::render("home/administration/AdminManagement");
    }
}
