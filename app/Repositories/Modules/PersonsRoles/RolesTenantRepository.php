<?php

namespace App\Repositories\Modules\PersonsRoles;

use App\Models\Modules\PersonsRoles\Roles\Role;
use Illuminate\Support\Collection;

class RolesTenantRepository
{
    function __construct(Role $model)
    {
        $this->model = $model;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->model->with(["modules", "users"])
            ->filter($filter) // scope
            ->search($search) // scope
            ->orderBy($orderBy[0], $orderBy[1])
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'roles', (int) $page);
    }

    public function createRole(Collection $data)
    {
        $role = $this->model->create($data->get("role"));
        $role->modules()->attach($data->get("modules"));
        return $role;
    }

    public function updateRole(Collection $data, string $id)
    {
        $role = $this->model->withTrashed()->findOrFail($id);
        $role->update($data->get("role"));
        $role->modules()->sync($data->get("modules"));

        return $role;
    }

    public function deleteRole(array $ids)
    {
        $roles = $this->model->findMany($ids);

        $there_are_no_related_users = $roles->every(function ($role) {
            return !$role->users()->exists();
        });

        if (!$there_are_no_related_users) {
            throw new \Exception("Erro! Cargos vinculados a usuários não podem ser deletados.", 409);
        }

        foreach ($roles as $role) {
            $role->delete();
        }

        return $roles;
    }
}
