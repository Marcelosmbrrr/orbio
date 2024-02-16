<?php

namespace App\Services\Modules\Administration;

use Illuminate\Support\Str;
use App\Notifications\Administration\TenantCreationNotification;
use App\Repositories\Modules\Administration\AdministrationRepository;

class AdministrationService
{
    function __construct(AdministrationRepository $repository)
    {
        $this->repository = $repository;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->repository->pagination($limit, $orderBy, $filter, $page, $search);
    }

    public function createTenant(array $data)
    {
        $data["password"] = Str::random(10);
        $data["role_id"] = 2;
        $tenant = $this->repository->createTenant(collect($data));
        $tenant->notify(new TenantCreationNotification($data["password"]));
    }

    public function updateTenant(array $data, string $id)
    {
        $data["role_id"] = 2;
        $tenant = $this->repository->updateTenant(collect($data), $id);
        $changes = $tenant->getChanges();
    }

    public function deleteTenant(array $ids)
    {
        $users = $this->repository->deleteTenant($ids);
    }
}
