<?php

namespace App\Http\Resources\Modules\Equipments;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Modules\Equipments\Battery;

class BatteriesModuleResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["batteries"] = [];

        foreach ($this->collection as $index => $battery) {

            $this->payload["batteries"][$index] = [
                "id" => $battery->id,
                "name" => $battery->name,
                "manufacturer" => $battery->manufacturer,
                "model" => $battery->model,
                "serial_number" => $battery->serial_number,
                "last_charge" => date("Y-m-d", strtotime($battery->last_charge)),
                "image_url" => $battery->image_path ? Storage::url($battery->image_path) : "none",
                "created_at" => $battery->created_at,
                "updated_at" => $battery->updated_at,
                "deleted_at" => $battery->deleted_at
            ];
        }

        // refactor: to one query
        $this->payload["group_counter"] = [
            "active" => Battery::where("tenant_id", session("tenant_id"))->where("deleted_at", null)->count(),
            "deleted" => Battery::where("tenant_id", session("tenant_id"))->onlyTrashed()->count()
        ];

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
