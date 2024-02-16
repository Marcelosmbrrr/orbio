<?php

namespace App\Services\Modules\PersonsRoles;

use Illuminate\Support\Str;
use App\Repositories\Modules\PersonsRoles\UsersTenantRepository;
use App\Notifications\PersonsRoles\UserCreationNotification;

class UsersTenantService
{
    function __construct(UsersTenantRepository $repository)
    {
        $this->repository = $repository;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->repository->pagination($limit, $orderBy, $filter, $page, $search);
    }

    public function createUser(array $data)
    {
        $data["password"] = strtolower(Str::random(10));
        $data["tenant_id"] = session("tenant_id");
        $data["login"] = strtoupper(Str::random(12));
        $user = $this->repository->createUser(collect($data));
        $user->notify(new UserCreationNotification($data["password"]));
    }

    public function updateUser(array $data, string $id)
    {
        $tenant = $this->repository->updateUser(collect($data), $id);
        $changes = $tenant->getChanges();
    }

    public function deleteUser(array $ids)
    {
        $users = $this->repository->deleteUser($ids);
    }
}
