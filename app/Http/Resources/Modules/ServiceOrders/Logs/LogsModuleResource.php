<?php

namespace App\Http\Resources\Modules\ServiceOrders\Logs;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\ResourceCollection;

class LogsModuleResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["logs"] = [];

        foreach ($this->collection as $index => $log) {

            $this->payload["logs"][$index] = [
                "id" => $log->id,
                "name" => $log->name,
                "filename" => $log->filename,
                "timestamp" => $log->timestamp,
                "coordinates" => $log->coordinates,
                "city" => $log->city,
                "state" => $log->state,
                "log_url" => Storage::url($log->log_path),
                "image_url" => $log->image_path ? Storage::url($log->image_path) : "none",
                "created_at" => $log->created_at,
                "updated_at" => $log->updated_at,
                "deleted_at" => $log->deleted_at
            ];

        }

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
