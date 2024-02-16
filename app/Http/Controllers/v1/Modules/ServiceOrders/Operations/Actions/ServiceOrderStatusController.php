<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use App\Models\Modules\ServiceOrders\ServiceOrder;

class ServiceOrderStatusController extends Controller
{

    function __construct(ServiceOrder $model)
    {
        $this->model = $model;
    }

    public function __invoke(Request $request, $service_order_id)
    {
        Gate::authorize('gos:write');

        $service_order = $this->model->find($service_order_id);

        if (($service_order->pilot()->exists() && $service_order->pilot[0]->id != Auth::user()->id) || !$service_order->status) {
            throw new \Exception("Ação não autorizada.", 403);
        }

        if ($request->status === "finished" || $request->status === "canceled") {
            $service_order->update([
                "situation" => $request->status,
                "status" => false,
                "observation" => $request->observation,
            ]);
        } else {
            $service_order->update([
                "situation" => $request->status,
                "attendant_id" => getAuth()->user()->id,
                "observation" => $request->observation,
            ]);
        }

        return response(["message" => "Status atualizado com sucesso!"], 200);
    }
}
