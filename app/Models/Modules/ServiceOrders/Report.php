<?php

namespace App\Models\Modules\ServiceOrders;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use App\Models\Modules\ServiceOrders\ServiceOrder;


class Report extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    function service_order()
    {
        return $this->belongsTo(ServiceOrder::class, "service_order_id", "id");
    }

    // Scope

    function scopeFilterByUser($query)
    {
        return $query->whereHas('service_order', function ($query) {
            $query->whereHas('users', function ($query) {
                $query->where('user_id', Auth::user()->id);
            });
        });
    }

    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {
            if (is_numeric($value_searched)) {
                $query->where('id', $value_searched);
            } else {
                $query
                    ->where('name', 'LIKE', '%' . $value_searched . '%');
            }
        });
    }
}
