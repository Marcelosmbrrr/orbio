<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use App\Models\Modules\ServiceOrders\Log;
use App\Services\Modules\ServiceOrders\LogService;
use App\Http\Resources\Modules\ServiceOrders\Logs\LogsModuleResource;

class ServiceOrderLogsController extends Controller
{
    function __construct(LogService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        Gate::authorize('gos:read');

        $limit = request()->limit;
        $page = request()->page;
        $search = request()->search ?? "";
        $orderBy = explode(",", request()->order);

        $payload = $this->service->pagination($limit, $orderBy, $page, $search);

        return response(new LogsModuleResource($payload), 200);
    }

    public function store(Request $request, string $service_order_id)
    {
        Gate::authorize('gos:write');

        $this->service->createLog($request->all(), $service_order_id);
        return response(["message" => "Log criado com sucesso!"], 201);
    }

    public function delete(Request $request)
    {
        Gate::authorize('gos:write');

        DB::transaction(function () use ($request) {

            $log = Log::find($request->log_id);

            if (!$log->service_order->status) {
                throw new \Exception("O log não pode ser deletado.", 409);
            }

            Storage::disk('public')->delete($log->log_path);
            Storage::disk('public')->delete($log->image_path);
            $log->delete();

        });

        return response(["message" => "Log deletado com sucesso!"], 200);
    }

    public function export(Request $request)
    {
        Gate::authorize('gos:read');

        $log = Log::find($request->log_id);

        if (!Storage::disk("public")->exists($log->log_path)) {
            throw new \Exception("Erro! O arquivo do log não foi encontrado.", 404);
        }

        $payload = [
            "contents" => Storage::disk("public")->get($log->log_path)
        ];

        return response($payload)->withHeaders([
            "Content-type" => "application/json"
        ]);
    }
}
