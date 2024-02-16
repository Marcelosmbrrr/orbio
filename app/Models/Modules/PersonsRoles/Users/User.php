<?php

namespace App\Models\Modules\PersonsRoles\Users;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Modules\PersonsRoles\Roles\Role;
use App\Models\Modules\PersonsRoles\Users\Profile;
use App\Models\Modules\ServiceOrders\ServiceOrder;
use App\Models\Modules\PersonsRoles\Users\PasswordReset;
use App\Models\Modules\ServiceOrders\Report;
use App\Models\Modules\FlightPlans\FlightPlan;
use App\Models\Modules\ServiceOrders\ServiceOrderUser;
use App\Models\Modules\ServiceOrders\Log;
use App\Models\Tenant;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $guarded = [];
    protected $hidden = [
        'password'
    ];

    function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    function profile()
    {
        return $this->morphOne(Profile::class, "profilable");
    }

    function logs()
    {
        return $this->hasMany(Log::class, "user_id", "id");
    }

    function role()
    {
        return $this->belongsTo(Role::class, "role_id", "id");
    }

    function service_orders()
    {
        return $this->belongsToMany(ServiceOrder::class, "service_order_user");
    }

    function flight_plans()
    {
        return $this->hasMany(FlightPlan::class, "tenant_id");
    }

    public function reports()
    {
        return $this->hasManyThrough(Report::class, ServiceOrderUser::class, 'user_id', 'service_order_id');
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
                $query->where('users.id', $value_searched);
            } else {
                $query
                    ->where('users.name', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('users.email', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('users.role.name', 'LIKE', '%' . $value_searched . '%');
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
