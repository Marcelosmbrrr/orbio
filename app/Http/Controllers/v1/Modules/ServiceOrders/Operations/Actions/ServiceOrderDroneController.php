<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\Equipments\Drone;
use App\Models\Modules\ServiceOrders\ServiceOrder;

class ServiceOrderDroneController extends Controller
{
    function __construct(Drone $droneModel, ServiceOrder $serviceOrderModel)
    {
        $this->droneModel = $droneModel;
        $this->serviceOrderModel = $serviceOrderModel;
    }

    public function index()
    {
        Gate::authorize('gos:read');

        $selections = request()->selections ?? "";
        $where = request()->where ?? false;
        $limit = 8;
        $page = request()->page;

        $items = collect([]);
        $query = $this->droneModel->query();
        $query->where("tenant_id", session("tenant_id"));

        $items = $query->paginate((int) $limit, $columns = ['*'], $pageName = 'drones', (int) $page);

        if ($items->count() === 0) {
            throw new \Exception("Nenhum drone encontrado.", 404);
        }

        $payload = [];
        foreach ($items as $key => $item) {

            $is_selected = gettype(array_search($item->id, explode(",", $selections))) === "integer" ? true : false; // index or false

            $payload["drones"][$key] = [
                "id" => $item->id,
                "selected" => $is_selected,
                "name" => $item->name,
                "model" => $item->model,
                "manufacturer" => $item->manufacturer,
                "serial_number" => $item->serial_number,
                "record_number" => $item->record_number,
                "incidents" => 0,
                "weight" => $item->weight,
                "image_url" => $item->image_path ? Storage::url($item->image_path) : "none",
            ];
        }

        $payload["paginator"]["total_records"] = $items->total();
        $payload["paginator"]["total_pages"] = $items->lastPage();

        return response($payload, 200);
    }

    public function store(Request $request)
    {
        Gate::authorize('gos:write');

        $service_order = $this->serviceOrderModel->find(request()->id);

        if (count($request->drones) === 0) {
            throw new \Exception("Nenhum drone selecionado.", 404);
        }

        $service_order->drones()->attach($request->drones);

        return response([
            "message" => "Drones adicionados com sucesso."
        ], 200);
    }

    public function delete(Request $request)
    {
        Gate::authorize('gos:write');

        $service_order = $this->serviceOrderModel->find($request->service_order_id);

        if (!$service_order->status) {
            throw new \Exception("O drone não pode ser deletado.", 409);
        }

        $service_order->drones()->detach($request->drone_id);

        return response(["message" => "Drone removido com sucesso."], 200);
    }
}
