<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Page;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Modules\ServiceOrders\ServiceOrder;

class ServiceOrdersPageController extends Controller
{

    function __construct(ServiceOrder $model)
    {
        $this->model = $model;
    }

    function serviceOrdersPage()
    {
        Gate::authorize('gos:read');
        return Inertia::render("home/service-orders/services/ServiceOrders");
    }

    function createServiceOrderPage()
    {
        Gate::authorize('gos:write');
        return Inertia::render("home/service-orders/services/CreateServiceOrder");
    }

    function createServiceOrderLogPage()
    {
        Gate::authorize('gos:write');
        return Inertia::render("home/service-orders/logs/CreateLog");
    }

    function createServiceOrderReportPage($id)
    {
        Gate::authorize('gos:write');

        // Get service order
        $service_order = $this->model->with(['pilot:id,name', 'client:id,name', 'drones', 'batteries', 'equipments', 'flight_plans', 'logs'])->find($id);

        $logs = $service_order->logs->map(function ($item) {
            return [
                "id" => $item->id,
                "number" => $item->number,
                "filename" => $item->filename,
                "coordinates" => $item->coordinates,
                "city" => $item->city,
                "state" => $item->state,
                "extra_data" => [
                    "filled" => false,
                    "temperature" => ["initial" => null, "final" => null],
                    "humidity" => ["initial" => null, "final" => null],
                    "wind_speed" => ["initial" => null, "final" => null],
                ],
                "image_url" => Storage::url($item->image_path)
            ];
        });

        $pilot = "";
        if ($service_order->pilot()->exists()) {
            $pilot = $service_order->pilot[0]->name;
        }

        $client = "";
        if ($service_order->client()->exists()) {
            $client = $service_order->client[0]->name;
        }

        $payload = [
            "id" => $service_order->id,
            "number" => $service_order->number,
            "city" => $service_order->flight_plans[0]->city,
            "state" => $service_order->flight_plans[0]->state,
            "pilot" => $pilot,
            "client" => $client,
            "attendant" => $service_order->attendant->name,
            "logs" => $logs
        ];

        return Inertia::render("home/service-orders/reports/CreateReport", $payload);
    }
}
