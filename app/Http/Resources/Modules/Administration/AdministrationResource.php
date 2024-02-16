<?php

namespace App\Http\Resources\Modules\Administration;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\DB;
use App\Models\Tenant;

class AdministrationResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["users"] = [];

        foreach ($this->collection as $index => $user) {

            if ($user->trashed()) {
                $title = "Desabilitado";
                $style_key = "disabled";
            } else {
                $title = $user->status ? "Ativo" : "Inativo";
                $style_key = $user->status ? "active" : "inative";
            }

            $this->payload["users"][$index] = [
                "id" => $user->id,
                "name" => $user->name,
                "role" => $user->role,
                "email" => $user->email,
                "status" => [
                    "value" => $user->status,
                    "title" => $title,
                    "style_key" => $style_key
                ],
                "created_at" => $user->created_at,
                "updated_at" => $user->updated_at,
                "deleted_at" => $user->deleted_at
            ];
        }

        $this->payload["group_counter"] = [
            "active" => Tenant::where("status", true)->where("deleted_at", null)->count(),
            "inative" => Tenant::where("status", false)->where("deleted_at", null)->count(),
            "deleted" => Tenant::onlyTrashed()->count()
        ];

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
