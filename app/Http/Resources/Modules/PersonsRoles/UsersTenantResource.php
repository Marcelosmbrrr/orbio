<?php

namespace App\Http\Resources\Modules\PersonsRoles;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Modules\PersonsRoles\Users\User;

class UsersTenantResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["users"] = [];

        foreach ($this->collection as $index => $user) {

            if ($user->trashed()) {
                $name = "Desabilitado";
                $classname = "disabled";
            } else {
                $name = $user->status ? "Ativo" : "Inativo";
                $classname = $user->status ? "active" : "inative";
            }

            $this->payload["users"][$index] = [
                "id" => $user->id,
                "name" => $user->name,
                "role" => $user->role,
                "email" => $user->email,
                "status" => [
                    "value" => $user->status,
                    "name" => $name,
                    "style_key" => $classname
                ],
                "created_at" => $user->created_at,
                "updated_at" => $user->updated_at,
                "deleted_at" => $user->deleted_at
            ];
        }

        $this->payload["group_counter"] = [
            "active" => User::where("tenant_id", session("tenant_id"))->where("status", true)->where("deleted_at", null)->count(),
            "inative" => User::where("tenant_id", session("tenant_id"))->where("status", false)->where("deleted_at", null)->count(),
            "deleted" => User::where("tenant_id", session("tenant_id"))->onlyTrashed()->count()
        ];

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
