<?php

namespace App\Models\Modules\ServiceOrders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Modules\ServiceOrders\ServiceOrder;

class Incident extends Model
{
    use HasFactory;

    protected $guarded = [];

    function service_order()
    {
        return $this->belongsTo(ServiceOrder::class, "service_order_id");
    }
}
