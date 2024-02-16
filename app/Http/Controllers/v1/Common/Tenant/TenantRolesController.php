<?php

namespace App\Http\Controllers\v1\Common\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Modules\PersonsRoles\Roles\Role;

class TenantRolesController extends Controller
{
    function __construct(Role $model)
    {
        $this->model = $model;
    }

    public function __invoke()
    {
        $where = request()->where ?? "";
        $select = request()->select === "all" ? request()->select : explode(",", request()->select);

        $query = $this->model->query();

        $query->whereNotIn("id", [1, 2]);

        if ((bool) $where) {
            $where = explode(".", $where);
            $query->where($where[0], $where[1]);
        }

        if ($select != "all") {
            $query->select($select);
        }

        $roles = $query->get();

        return response($roles, 200);
    }
}
