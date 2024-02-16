<?php

namespace App\Models\Modules\ServiceOrders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderFlightPlan extends Model
{
    use HasFactory;

    public $table = "service_order_flight_plan";
    protected $guarded = [];
}
