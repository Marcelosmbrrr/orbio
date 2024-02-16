<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\Modules\ServiceOrders\ServiceOrder;
use App\Models\Modules\ServiceOrders\Report;
use App\Http\Requests\Modules\ServiceOrders\Reports\CreateReportRequest;

class ServiceOrderReportController extends Controller
{
    function __construct(Report $reportModel, ServiceOrder $serviceOrderModel)
    {
        $this->serviceOrderModel = $serviceOrderModel;
        $this->reportModel = $reportModel;
    }

    public function index(Request $request, $id)
    {
        Gate::authorize('gos:read');

        $service_order = $this->serviceOrderModel->with(['creator:id,name', 'pilot:id,name', 'client:id,name', 'drones', 'batteries', 'equipments', 'flight_plans', 'logs'])->find($id);

        $logs = $service_order->logs->map(function ($item) {
            return [
                "id" => $item->id,
                "name" => $item->name,
                "filename" => $item->filename,
                "timestamp" => $item->timestamp,
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

        $payload = [
            "id" => $service_order->id,
            "number" => $service_order->number,
            "creator" => $service_order->creator[0]->name,
            "pilot" => $service_order->pilot[0]->name,
            "client" => $service_order->client[0]->name,
            "logs" => $logs
        ];

        return response()->json($payload, 200);
    }

    public function store(CreateReportRequest $request)
    {
        Gate::authorize('gos:write');

        return DB::transaction(function () use ($request) {

            $service_order = $this->serviceOrderModel->find(request()->service_order_id);

            if (!$request->file("file")) {
                throw new \Exception("Erro! O arquivo não foi enviado.");
            }

            $file_content = file_get_contents($request->file("file"));
            $filename = time() . ".pdf";
            $file_path = getTenantUUID() . "/reports/$filename";

            $report = $this->reportModel->create([
                "service_order_id" => $service_order->id,
                "name" => $request->name,
                "file_path" => $file_path,
            ]);

            Storage::disk('public')->put($file_path, $file_content);

            return $report;
        });

        return response()->json(["message" => "Relatório criado com sucesso."], 200);
    }

    public function delete($report_id)
    {

        Gate::authorize('gos:write');

        $report = $this->reportModel->find($report_id);

        if (!$report->service_order->status) {
            throw new \Exception("O relatório não pode ser deletado.", 409);
        }

        $report->delete();

        Storage::disk('public')->delete($report->file_path);

        return response()->json(["message" => "Relatório excluído com sucesso."], 200);
    }

    public function export($report_id)
    {
        Gate::authorize('gos:read');

        $report = $this->reportModel->find($report_id);

        if (!Storage::disk("public")->exists($report->file_path)) {
            throw new \Exception("Nenhum relatório encontrado.", 404);
        }

        $file_contents = Storage::disk("public")->get($report->file_path);

        return response($file_contents)->withHeaders([
            "Content-type" => "application/json"
        ]);
    }
}
