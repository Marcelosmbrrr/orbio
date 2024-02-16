<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        //
    ];

    public function boot(): void
    {
        // === ADMINISTRATION === //

        Gate::define("gadmin:read", function ($user = null): bool {
            return getAuth()->user()->role->modules[0]->pivot->read;
        });

        Gate::define("gadmin:write", function ($user = null): bool {
            return getAuth()->user()->role->modules[0]->pivot->write;
        });

        // === PERSONS AND ROLES === //

        Gate::define("gpc:read", function ($user = null): bool {
            return getAuth()->user()->role->modules[1]->pivot->read;
        });

        Gate::define("gpc:write", function ($user = null): bool {
            return getAuth()->user()->role->modules[1]->pivot->write;
        });

        // === FLIGHT PLANS === //

        Gate::define("gpv:read", function ($user = null): bool {
            return getAuth()->user()->role->modules[2]->pivot->read;
        });

        Gate::define("gpv:write", function ($user = null): bool {
            return getAuth()->user()->role->modules[2]->pivot->write;
        });

        // === SERVICE ORDERS === //

        Gate::define("gos:read", function ($user = null): bool {
            return getAuth()->user()->role->modules[3]->pivot->read;
        });

        Gate::define("gos:write", function ($user = null): bool {
            return getAuth()->user()->role->modules[3]->pivot->write;
        });

        // === EQUIPMENTS === //

        Gate::define("ge:read", function ($user = null): bool {
            return getAuth()->user()->role->modules[4]->pivot->read;
        });

        Gate::define("ge:write", function ($user = null): bool {
            return getAuth()->user()->role->modules[4]->pivot->write;
        });
    }
}
