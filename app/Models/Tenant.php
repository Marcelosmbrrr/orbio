<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Modules\PersonsRoles\Users\User;
use App\Models\Modules\PersonsRoles\Roles\Role;
use App\Models\Modules\ServiceOrders\ServiceOrder;
use App\Models\Modules\FlightPlans\FlightPlan;
use App\Models\Modules\Equipments\Drone;
use App\Models\Modules\Equipments\Battery;
use App\Models\Modules\Equipments\Equipment;
use App\Models\Modules\PersonsRoles\Users\Profile;
use App\Models\Modules\PersonsRoles\Users\PasswordReset;

class Tenant extends Authenticatable
{
    use HasFactory, SoftDeletes, Notifiable;

    protected $guard = 'tenant';
    protected $guarded = [];

    function role()
    {
        return $this->belongsTo(Role::class);
    }

    function profile()
    {
        return $this->morphOne(Profile::class, "profilable");
    }

    function users()
    {
        return $this->hasMany(User::class, "tenant_id");
    }

    function service_orders()
    {
        return $this->hasMany(ServiceOrder::class, "tenant_id");
    }

    function flight_plans()
    {
        return $this->hasMany(FlightPlan::class, "tenant_id");
    }

    function drones()
    {
        return $this->hasMany(Drone::class, "tenant_id");
    }

    function batteries()
    {
        return $this->hasMany(Battery::class, "tenant_id");
    }

    function equipment()
    {
        return $this->hasMany(Equipment::class, "tenant_id");
    }

    function password_reset_token()
    {
        return $this->morphMany(PasswordReset::class, "resettable")->where("deleted_at", null);
    }

    // Acessors and mutators

    public function getFirstNameAttribute(): string
    {
        return explode(" ", $this->name)[0];
    }

    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => Hash::make($value),
        );
    }
    // Scopes

    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {
            if (is_numeric($value_searched)) {
                $query->where('tenants.id', $value_searched);
            } else {
                $query
                    ->where('tenants.name', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('tenants.email', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('tenants.role.name', 'LIKE', '%' . $value_searched . '%');
            }
        });
    }

    function scopeFilter($query, string $filter)
    {
        if ($filter === "all") {
            return $query->withTrashed();
        } else if ($filter === "active") {
            return $query->where("status", true);
        } else if ($filter === "inative") {
            return $query->where("status", false);
        } else if ($filter === "disabled") {
            return $query->onlyTrashed();
        }
    }
}
