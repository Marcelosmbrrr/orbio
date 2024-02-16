<?php

namespace App\Models\Modules\ServiceOrders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use App\Models\Modules\ServiceOrders\ServiceOrder;
use App\Models\Modules\PersonsRoles\Users\User;

class Log extends Model
{
    use HasFactory;

    protected $guarded = [];

    function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    function service_order()
    {
        return $this->belongsTo(ServiceOrder::class, "service_order_id");
    }

    // Scope

    function scopeFilterByUser($query)
    {
        return $query->where('user_id', Auth::user()->id);
    }

    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {
            if (is_numeric($value_searched)) {
                $query->where('id', $value_searched);
            } else {
                $query
                    ->where('name', 'LIKE', '%' . $value_searched . '%')
                    ->orWhere('filename', 'LIKE', '%' . $value_searched . '%');
            }
        });
    }
}
