<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Modules\Equipments\Drone;

class DronesModuleResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["drones"] = [];

        foreach ($this->collection as $index => $drone) {

            $this->payload["drones"][$index] = [
                "id" => $drone->id,
                "name" => $drone->name,
                "manufacturer" => $drone->manufacturer,
                "model" => $drone->model,
                "record_number" => $drone->record_number,
                "serial_number" => $drone->serial_number,
                "weight" => $drone->weight,
                "image_url" => $drone->image_path ? Storage::url($drone->image_path) : "none",
                "created_at" => $drone->created_at,
                "updated_at" => $drone->updated_at,
                "deleted_at" => $drone->deleted_at
            ];

        }

        $this->payload["group_counter"] = [
            "active" => Drone::where("tenant_id", session("tenant_id"))->where("deleted_at", null)->count(),
            "deleted" => Drone::where("tenant_id", session("tenant_id"))->onlyTrashed()->count()
        ];

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
