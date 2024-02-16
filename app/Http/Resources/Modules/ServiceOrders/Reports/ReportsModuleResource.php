<?php

namespace App\Http\Resources\Modules\ServiceOrders\Reports;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ReportsModuleResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["reports"] = [];

        foreach ($this->collection as $index => $report) {

            $this->payload["reports"][$index] = [
                "id" => $report->id,
                "name" => $report->name,
                "service_order" => [
                    "id" => $report->service_order->id,
                    "name" => $report->service_order->number,
                    "creator" => $report->service_order->creator->name,
                    "pilot" => $report->service_order->users->where("pivot.role_in", "pilot")->first()->name ?? "",
                    "client" => $report->service_order->users->where("pivot.role_in", "client")->first()->name ?? "",
                ],
                "file_path" => Storage::url($report->image_path),
                "created_at" => date("d-m-Y", strtotime($report->created_at)),
                "deleted_at" => $report->deleted_at
            ];
        }

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
