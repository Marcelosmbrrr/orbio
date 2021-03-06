<?php

namespace App\Models\Pivot;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceOrderHasUserModel extends Model
{
    use HasFactory;

    protected $table = "service_order_has_user";
    public $timestamps = false;
    protected $guarded = [];

    function users(){
        return $this->belongsTo("App\Models\User\UserModel", "user_id");
    }

    function service_order(){
        return $this->belongsTo("App\Models\Orders\ServiceOrderModel", "service_order_id");
    }
}
