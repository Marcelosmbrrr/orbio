<?php

namespace App\Services\Modules\PersonsRoles;

use App\Repositories\Modules\PersonsRoles\RolesTenantRepository;

class RolesTenantService
{
    function __construct(RolesTenantRepository $repository)
    {
        $this->repository = $repository;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->repository->pagination($limit, $orderBy, $filter, $page, $search);
    }

    public function createRole(array $data)
    {
        $data_formatted["role"] = [
            "name" => $data["name"],
            "tenant_id" => getAuth()->user()->id,
            "profile_data" => []
        ];

        $profile_data = [];
        foreach ($data["profile_data"] as $key => $value) {
            $profile_data[$key] = intval($value);
        }

        $data_formatted["role"]["profile_data"] = json_encode($profile_data);

        foreach ($data["modules"] as $value) {
            $data_formatted["modules"][$value["id"]] = [
                "read" => $value["read"],
                "write" => $value["write"]
            ];
        }

        $role = $this->repository->createRole(collect($data_formatted));
    }

    public function updateRole(array $data, string $id)
    {
        $data_formatted["role"] = [
            "name" => $data["name"],
            "profile_data" => $data["profile_data"]
        ];

        $profile_data = [];
        foreach ($data["profile_data"] as $key => $value) {
            $profile_data[$key] = intval($value);
        }

        $data_formatted["role"]["profile_data"] = json_encode($profile_data);

        foreach ($data["modules"] as $key => $value) {
            $data_formatted["modules"][$value["id"]] = [
                "read" => $value["read"],
                "write" => $value["write"]
            ];
        }

        $data_formatted["enable"] = $data["enable"];

        $role = $this->repository->updateRole(collect($data_formatted), $id);
    }

    public function deleteRole(array $ids)
    {
        $this->repository->deleteRole($ids);
    }
}
