<?php

namespace App\Models\Modules\Equipments;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Modules\ServiceOrders\ServiceOrder;
use App\Models\Tenant;

class Drone extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    function service_orders()
    {
        return $this->belongsToMany(ServiceOrder::class, "service_order_drone", "drone_id");
    }

    // Scopes

    function scopeSearch($query, $value_searched)
    {
        return $query->when($value_searched, function ($query, $value_searched) {

            $query->when(is_numeric($value_searched), function ($query) use ($value_searched) {
                $query->where('id', $value_searched)
                    ->orWhere('weight', $value_searched);
            }, function ($query) use ($value_searched) {
                $query->where('name', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('manufacturer', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('model', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('record_number', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('serial_number', 'LIKE', '%' . $value_searched . '%');
            });
        });
    }

    function scopeFilter($query, string $filter)
    {
        if ($filter === "all") {
            return $query->withTrashed();
        } else if ($filter === "active") {
            return $query->where("deleted_at", null);
        } else if ($filter === "disabled") {
            return $query->onlyTrashed();
        } 
    }
}
