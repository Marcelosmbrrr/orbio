<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\Equipments\Battery;
use App\Models\Modules\ServiceOrders\ServiceOrder;

class ServiceOrderBatteryController extends Controller
{
    function __construct(Battery $batteryModel, ServiceOrder $serviceOrderModel)
    {
        $this->batteryModel = $batteryModel;
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
        $query = $this->batteryModel->query();
        $query->where("tenant_id", session("tenant_id"));

        $items = $query->paginate((int) $limit, $columns = ['*'], $pageName = 'batteries', (int) $page);

        if ($items->count() === 0) {
            throw new \Exception("Nenhuma bateria encontrada.", 404);
        }

        $payload = [];
        foreach ($items as $key => $item) {

            $is_selected = gettype(array_search($item->id, explode(",", $selections))) === "integer" ? true : false; // index or false

            $payload["batteries"][$key] = [
                "id" => $item->id,
                "selected" => $is_selected,
                "name" => $item->name,
                "model" => $item->model,
                "manufacturer" => $item->manufacturer,
                "serial_number" => $item->serial_number,
                "last_charge" => $item->last_charge,
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

        if (count($request->batteries) === 0) {
            throw new \Exception("Nenhuma bateria selecionada.", 404);
        }

        $service_order->batteries()->attach($request->batteries);

        return response([
            "message" => "Baterias adicionadas com sucesso."
        ], 200);
    }

    public function delete(Request $request)
    {
        Gate::authorize('gos:write');

        $service_order = $this->serviceOrderModel->find($request->service_order_id);

        if (!$service_order->status) {
            throw new \Exception("A bateria não pode ser deletada.", 409);
        }

        $service_order->batteries()->detach($request->battery_id);

        return response(["message" => "Bateria removida com sucesso."], 200);
    }
}
