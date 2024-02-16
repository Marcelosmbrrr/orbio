<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Models\Modules\PersonsRoles\Users\User;
use App\Models\Modules\ServiceOrders\ServiceOrder;

class ServiceOrderPilotController extends Controller
{
    public function __construct(User $userModel, ServiceOrder $serviceOrderModel)
    {
        $this->userModel = $userModel;
        $this->serviceOrderModel = $serviceOrderModel;
    }

    public function index()
    {
        Gate::authorize('gos:read');

        $selections = request()->selections ?? "";
        $where = request()->where ?? false;
        $limit = request()->limit;
        $page = request()->page;

        $items = collect([]);

        $query = $this->userModel->query();
        $query->where("tenant_id", session("tenant_id"));
        $query->where('role_id', 3);

        $items = $query->paginate((int) $limit, $columns = ['*'], $pageName = 'pilots', (int) $page);

        if ($items->count() === 0) {
            throw new \Exception("Nenhum piloto encontrado.", 404);
        }

        $payload = [];
        foreach ($items as $key => $item) {

            $is_selected = gettype(array_search($item->id, explode(",", $selections))) === "integer" ? true : false; // index or false

            $payload["pilots"][$key] = [
                "id" => $item->id,
                "selected" => $is_selected,
                "status" => $item->status ? "ativo" : "inativo",
                "name" => $item->name,
                "email" => $item->email,
                "cpf" => $item->profile->document->cpf ?? "Não informado",
                "cnpj" => $item->profile->document->cnpj ?? "Não informado"
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

        if (!$request->pilot_id) {
            throw new \Exception("Nenhum piloto selecionado.", 404);
        }

        $service_order->users()->attach($request->pilot_id, ["role_in" => "pilot"]);

        return response(["message" => "Piloto atualizado com sucesso."], 200);
    }

    public function delete(Request $request)
    {
        Gate::authorize('gos:write');

        $service_order = $this->serviceOrderModel->find($request->service_order_id);

        if (!$service_order->status) {
            throw new \Exception("O piloto não pode ser deletado.", 409);
        }

        $service_order->users()->detach($request->pilot_id);

        return response(["message" => "Piloto removido com sucesso."], 200);
    }
}
