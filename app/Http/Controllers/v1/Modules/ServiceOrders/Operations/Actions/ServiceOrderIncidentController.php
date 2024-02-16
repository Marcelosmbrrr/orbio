<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Modules\ServiceOrders\Incidents\CreateIncidentRequest;
use App\Http\Requests\Modules\ServiceOrders\Incidents\EditIncidentRequest;
use App\Models\Modules\ServiceOrders\Incident;

class ServiceOrderIncidentController extends Controller
{
    function __construct(Incident $model)
    {
        $this->incidentModel = $model;
    }

    public function index()
    {
        Gate::authorize('gos:read');

        $selections = request()->selections ?? "";
        $where = request()->where ?? false;
        $limit = 8;
        $page = request()->page;

        $items = collect([]);
        $query = $this->incidentModel->query();
        $query->where("service_order_id", request()->service_order_id);

        $items = $query->paginate((int) $limit, $columns = ['*'], $pageName = 'incidents', (int) $page);

        if ($items->count() === 0) {
            throw new \Exception("Nenhum incidente encontrado.", 404);
        }

        $payload = [];
        foreach ($items as $key => $item) {
            $payload["incidents"][$key] = [
                "id" => $item->id,
                "date" => date("Y-m-d", strtotime($item->date)),
                "type" => $item->type,
                "description" => $item->description
            ];
        }

        $payload["paginator"]["total_records"] = $items->total();
        $payload["paginator"]["total_pages"] = $items->lastPage();

        return response($payload, 200);
    }

    public function store(CreateIncidentRequest $request, string $service_order_id)
    {
        Gate::authorize('gos:write');

        $this->incidentModel->create([
            "type" => $request->type,
            "description" => $request->description,
            "date" => $request->date,
            "service_order_id" => $service_order_id
        ]);

        return response(["message" => "Incidente criado com sucesso."], 201);
    }

    public function update(EditIncidentRequest $request, string $id)
    {
        Gate::authorize('gos:write');

        $this->incidentModel->where('id', $id)->update($request->validated());

        return response(["message" => "Incidente atualizado com sucesso."], 200);
    }

    public function destroy(Request $request)
    {
        Gate::authorize('gos:write');

        $incident = $this->incidentModel->find($request->incident_id);

        if (!$incident->service_order->status) {
            throw new \Exception("O incidente não pode ser deletado.", 409);
        }

        $incident->delete();

        return response(["message" => "Incidente deletado com sucesso."], 200);
    }
}
