<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\FlightPlans\FlightPlan;
use App\Models\Modules\ServiceOrders\ServiceOrder;

class ServiceOrderFlightPlanController extends Controller
{
    function __construct(FlightPlan $flightPlanModel, ServiceOrder $serviceOrderModel)
    {
        $this->flightPlanModel = $flightPlanModel;
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
        $query = $this->flightPlanModel->query();
        $query->where("tenant_id", session("tenant_id"));
        $query->with(['user']);

        $items = $query->paginate((int) $limit, $columns = ['*'], $pageName = 'flight-plans', (int) $page);

        if ($items->count() === 0) {
            throw new \Exception("Nenhum plano de voo encontrado.", 404);
        }

        $payload = [];
        foreach ($items as $key => $item) {

            $is_selected = gettype(array_search($item->id, explode(",", $selections))) === "integer" ? true : false; // index or false

            $payload["flight_plans"][$key] = [
                "id" => $item->id,
                "selected" => $is_selected,
                "name" => $item->name,
                "coordinates" => $item->coordinates,
                "state" => $item->state,
                "city" => $item->city,
                "image_url" => Storage::url($item->image_path),
                "incidents" => 0,
                "file_path" => $item->file_path,
                "created_at" => $item->created_at,
                "updated_at" => $item->updated_at,
                "deleted_at" => $item->deleted_at
            ];
        }

        $payload["paginator"] = [
            "total_records" => $items->total(),
            "total_pages" => $items->lastPage()
        ];

        return response($payload, 200);
    }

    public function store(Request $request)
    {
        Gate::authorize('gos:write');

        $service_order = $this->serviceOrderModel->find(request()->id);

        if (count($request->flight_plans) === 0) {
            throw new \Exception("Nenhum plano de voo selecionado.", 404);
        }

        $service_order->flight_plans()->attach($request->flight_plans);

        return response([
            "message" => "Planos de voo adicionados com sucesso."
        ], 200);
    }

    public function delete(Request $request)
    {
        Gate::authorize('gos:write');

        $service_order = $this->serviceOrderModel->find($request->service_order_id);

        if (!$service_order->status) {
            throw new \Exception("O plano de voo não pode ser deletado.", 409);
        }

        $service_order->flight_plans()->detach($request->flight_plan_id);

        return response(["message" => "Plano de voo removido com sucesso."], 200);
    }
}
