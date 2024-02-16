<?php

namespace App\Http\Resources\Modules\FlightPlans;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Models\Modules\FlightPlans\FlightPlan;

class FlightPlansModuleResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["plans"] = [];

        foreach ($this->collection as $index => $flight_plan) {

            $this->payload["plans"][$index] = [
                "id" => $flight_plan->id,
                "name" => $flight_plan->name,
                "coordinates" => $flight_plan->coordinates,
                "state" => $flight_plan->state,
                "city" => $flight_plan->city,
                "image_url" => Storage::url($flight_plan->image_path),
                "file_path" => $flight_plan->file_path,
                "created_at" => $flight_plan->created_at,
                "updated_at" => $flight_plan->updated_at,
                "deleted_at" => $flight_plan->deleted_at
            ];
        }

        $this->payload["group_counter"] = [
            "active" => FlightPlan::where("tenant_id", session("tenant_id"))->where("deleted_at", null)->count(),
            "deleted" => FlightPlan::where("tenant_id", session("tenant_id"))->onlyTrashed()->count()
        ];

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
