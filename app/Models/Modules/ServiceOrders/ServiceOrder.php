<?php

namespace App\Models\Modules\ServiceOrders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Modules\PersonsRoles\Users\User;
use App\Models\Modules\ServiceOrders\Report;
use App\Models\Modules\FlightPlans\FlightPlan;
use App\Models\Modules\Equipments\Drone;
use App\Models\Modules\Equipments\Battery;
use App\Models\Modules\Equipments\Equipment;
use App\Models\Modules\ServiceOrders\Incident;
use App\Models\Tenant;

class ServiceOrder extends Model
{
    use HasFactory;

    public $table = "service_orders";
    protected $guarded = [];

    function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    function users()
    {
        return $this->belongsToMany(User::class, "service_order_user")->withPivot('role_in');
    }

    function attendant()
    {
        return $this->belongsTo(User::class, "attendant_id");
    }

    public function pilot()
    {
        return $this->belongsToMany(User::class, "service_order_user")
            ->wherePivot('role_in', 'pilot');
    }

    public function client()
    {
        return $this->belongsToMany(User::class, "service_order_user")
            ->wherePivot('role_in', 'client');
    }

    function flight_plans()
    {
        return $this->belongsToMany(FlightPlan::class, "service_order_flight_plan");
    }

    function logs()
    {
        return $this->hasMany(Log::class, "service_order_id");
    }

    function drones()
    {
        return $this->belongsToMany(Drone::class, "service_order_drone");
    }

    function batteries()
    {
        return $this->belongsToMany(Battery::class, "service_order_battery");
    }

    function equipments()
    {
        return $this->belongsToMany(Equipment::class, "service_order_equipment");
    }

    function reports()
    {
        return $this->hasMany(Report::class, "service_order_id", "id");
    }

    function incidents()
    {
        return $this->hasMany(Incident::class, "service_order_id", "id");
    }

    // Scope

    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {
            if (is_numeric($value_searched)) {
                $query
                    ->where('id', $value_searched)
                    ->orWhere('number', $value_searched);
            }
        });
    }

    function scopeFilterGroup($query, string $situation)
    {
        $is_tenant = getAuth()->user()->role_id === 2;
        $is_pilot = getAuth()->user()->role_id === 3;
        $is_client = getAuth()->user()->role_id === 4;

        if ($is_tenant) {

            // Caso seja tenant, apenas filtrar pela $situation
            return $query->where('situation', $situation);
        } else if ($is_client) {

            // Caso seja cliente, filtrar pela $situation e pelo relacionamento "client"
            return $query->where('situation', $situation)
                ->whereHas('client', function ($subquery) {
                    $subquery->where('user_id', getAuth()->user()->id);
                });

        } else if ($is_pilot) {

            if ($situation === "created") {

                // considerar apenas situation e existencia ou n de 'pilot'

                return $query->where('situation', $situation)->where(function ($subquery) {
                    $subquery->whereHas('pilot', function ($pilotSubquery) {
                        $pilotSubquery->where('user_id', getAuth()->user()->id);
                    })->orDoesntHave('pilot');
                })->doesntHave('attendant');

            } else {

                // considerar apenas situation e existencia ou n de 'attendant'

                return $query->where('situation', $situation)->whereHas('attendant', function ($subquery) {
                    $subquery->where('attendant_id', getAuth()->user()->id);
                });
            }
        }
    }
}
