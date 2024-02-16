<?php

namespace App\Http\Controllers\v1\Modules\PersonsRoles\Page;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class PersonsAndRolesPageController extends Controller
{
    function usersPage()
    {
        Gate::authorize('gpc:read');
        return Inertia::render("home/persons-roles/UsersManagement");
    }

    function rolesPage()
    {
        Gate::authorize('gpc:read');
        return Inertia::render("home/persons-roles/RolesManagement");
    }
}
