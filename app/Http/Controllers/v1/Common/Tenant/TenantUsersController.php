<?php

namespace App\Http\Controllers\v1\Common\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Modules\PersonsRoles\Users\User;

class TenantUsersController extends Controller
{
    function __construct(User $model)
    {
        $this->model = $model;
    }

    public function __invoke()
    {
        $where = request()->where ?? "";
        $select = request()->select === "all" ? request()->select : explode(",", request()->select);

        $query = $this->model->query();

        $query->where("tenant_id", session("tenant_id"));

        if ((bool) $where) {
            $where = explode(",", $where);
            $query->where($where[0], $where[1]);
        }

        if ($select != "all") {
            $query->select($select);
        }

        $users = $query->get();

        return response($users, 200);
    }
}
