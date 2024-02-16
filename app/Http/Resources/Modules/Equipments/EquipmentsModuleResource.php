<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Modules\Equipments\Equipment;

class EquipmentsModuleResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["equipments"] = [];

        foreach ($this->collection as $index => $equipment) {

            $this->payload["equipments"][$index] = [
                "id" => $equipment->id,
                "name" => $equipment->name,
                "manufacturer" => $equipment->manufacturer,
                "model" => $equipment->model,
                "record_number" => $equipment->record_number,
                "serial_number" => $equipment->serial_number,
                "weight" => $equipment->weight,
                "image_url" => $equipment->image_path ? Storage::url($equipment->image_path) : "none",
                "created_at" => $equipment->created_at,
                "updated_at" => $equipment->updated_at,
                "deleted_at" => $equipment->deleted_at
            ];
        }

        $this->payload["group_counter"] = [
            "active" => Equipment::where("tenant_id", session("tenant_id"))->where("deleted_at", null)->count(),
            "deleted" => Equipment::where("tenant_id", session("tenant_id"))->onlyTrashed()->count()
        ];

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
