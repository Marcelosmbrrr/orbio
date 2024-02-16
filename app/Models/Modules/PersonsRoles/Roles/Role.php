<?php

namespace App\Models\Modules\PersonsRoles\Roles;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
//use App\Models\Traits\Tenantable;
use App\Models\Modules\Module;
use App\Models\Modules\PersonsRoles\Users\User;
use App\Models\Tenant;

class Role extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    function users()
    {
        return $this->hasMany(User::class, "role_id")->withTrashed();
    }

    function modules()
    {
        return $this->belongsToMany(Module::class, "role_module", "role_id")->withPivot('read', 'write');
    }

    // Scopes

    function scopeSearch($query, $value_searched)
    {
        return $query->when((bool) $value_searched, function ($query) use ($value_searched) {
            if (is_numeric($value_searched)) {
                $query->where('roles.id', $value_searched);
            } else {
                $query->where('roles.name', 'LIKE', '%' . $value_searched . '%');
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
