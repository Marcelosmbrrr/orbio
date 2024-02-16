<?php

namespace App\Repositories\Modules\Administration;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Tenant;

class AdministrationRepository
{
    function __construct(Tenant $model)
    {
        $this->model = $model;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->model
            ->with(["role"])
            ->filter($filter) // scope
            ->search($search) // scope
            ->orderBy($orderBy[0], $orderBy[1])
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'tenants', (int) $page);
    }

    public function createTenant(Collection $data)
    {
        $user = $this->model->create([
            ...$data->all(),
            "uuid" => Str::uuid()
        ]);
        $user->profile()->create();

        return $user;
    }

    public function updateTenant(Collection $data, string $id)
    {
        $user = $this->model->withTrashed()->findOrFail($id);
        $user->update($data->except(["enable"])->toArray());

        return $user;
    }

    public function deleteTenant(array $ids)
    {
        return DB::transaction(function () use ($ids) {

            $tenants = $this->model->findMany($ids);
            foreach ($tenants as $tenant) {
                $tenant->delete();
            }

            return $tenants;
        });
    }
}
