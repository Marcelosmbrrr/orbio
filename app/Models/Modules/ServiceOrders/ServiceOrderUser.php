<?php

namespace App\Models\Modules\ServiceOrders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\Tenantable;

class ServiceOrderUser extends Model
{
    use HasFactory, Tenantable;

    public $table = "service_order_user";
    protected $guarded = [];
}
