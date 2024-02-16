<?php

namespace App\Http\Resources\Modules\PersonsRoles;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Modules\PersonsRoles\Roles\Role;

class RolesTenantResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["roles"] = [];

        foreach ($this->collection as $index => $role) {

            $this->payload["roles"][$index] = [
                "id" => $role->id,
                "name" => $role->name,
                "modules" => null,
                "profile_data" => null,
                "created_at" => $role->created_at,
                "updated_at" => $role->updated_at,
                "deleted_at" => $role->deleted_at
            ];

            $profile_data = [];
            foreach (json_decode($role->profile_data) as $key => $value) {
                $profile_data[$key] = intval($value);
            }

            $modules = [];
            foreach ($role->modules as $index_module => $module) {
                $modules[$index_module] = [
                    "id" => $module->id,
                    "name" => $module->name,
                    "read" => $module->pivot->read,
                    "write" => $module->pivot->write
                ];
            }

            $this->payload["roles"][$index]["profile_data"] = $profile_data;
            $this->payload["roles"][$index]["modules"] = $modules;
        }

        $this->payload["group_counter"] = [
            "active" => Role::where("tenant_id", session("tenant_id"))->where("deleted_at", null)->count(),
            "deleted" => Role::where("tenant_id", session("tenant_id"))->onlyTrashed()->count()
        ];

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
