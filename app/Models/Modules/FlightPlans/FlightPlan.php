<?php

namespace App\Models\Modules\FlightPlans;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Modules\PersonsRoles\Users\User;
use App\Models\Modules\ServiceOrders\ServiceOrder;
use App\Models\Tenant;

class FlightPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    function user()
    {
        return $this->belongsTo(User::class, "creator_id", "id");
    }

    function service_orders()
    {
        return $this->belongsToMany(ServiceOrder::class, "service_order_flight_plan", "flight_plan_id", "service_order_id");
    }

    // Scopes

    function scopeFilterByUser($query)
    {
        return $query->where("creator_id", Auth::user()->id);
    }

    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {
            if (is_numeric($value_searched)) {
                $query->where('id', $value_searched);
            } else {
                $query
                    ->where('name', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('city', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('state', 'LIKE', '%' . $value_searched . '%');
            }
        });
    }

    function scopeFilter($query, string $filter)
    {
        if ($filter === "active") {
            return $query->where("deleted_at", null);
        } else if ($filter === "disabled") {
            return $query->onlyTrashed();
        }
    }
}
