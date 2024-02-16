<?php

namespace App\Repositories\Modules\PersonsRoles;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Models\Modules\PersonsRoles\Users\User;

class UsersTenantRepository
{
    function __construct(User $model)
    {
        $this->model = $model;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->model
            ->where('tenant_id', session('tenant_id'))
            ->with(["role"])
            ->filter($filter) // scope
            ->search($search) // scope
            ->orderBy($orderBy[0], $orderBy[1])
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'users', (int) $page);
    }

    public function createUser(Collection $data)
    {
        $user = $this->model->create($data->all());
        $user->profile()->create();

        return $user;
    }

    public function updateUser(Collection $data, string $id)
    {
        $user = $this->model->withTrashed()->findOrFail($id);
        $user->update($data->except(["enable"])->toArray());

        return $user;
    }

    public function deleteUser(array $ids)
    {
        return DB::transaction(function () use ($ids) {

            $users = $this->model->findMany($ids);
            foreach ($users as $user) {
                $user->delete();
            }
            
        });
    }
}
