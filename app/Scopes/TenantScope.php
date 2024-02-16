<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        // Automatically add where tenant_id = session('tenant_id') to all queries
        if(session()->has('tenant_id') && !is_null(session()->get('tenant_id'))) {
            $builder->where('tenant_id', session('tenant_id'));
        }
    }
}