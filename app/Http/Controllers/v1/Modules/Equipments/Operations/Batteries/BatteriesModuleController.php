<?php

namespace App\Http\Controllers\v1\Modules\Equipments\Operations\Batteries;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Services\Modules\Equipments\BatteryService;
use App\Http\Resources\Modules\Equipments\BatteriesModuleResource;
use App\Http\Requests\Modules\Equipments\Batteries\CreateBatteryRequest;
use App\Http\Requests\Modules\Equipments\Batteries\EditBatteryRequest;

class BatteriesModuleController extends Controller
{
    function __construct(BatteryService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        Gate::authorize('ge:read');

        $limit = request()->limit;
        $page = request()->page;
        $search = request()->search ?? "";
        $orderBy = explode(",", request()->order);
        $filter = request()->filter;

        $payload = $this->service->pagination($limit, $orderBy, $filter, $page, $search);

        return response(new BatteriesModuleResource($payload), 200);
    }

    public function store(CreateBatteryRequest $request)
    {
        Gate::authorize('ge:write');

        $this->service->createBattery($request->validated());
        return response(["message" => "Bateria criada com sucesso!"], 201);
    }

    public function update(EditBatteryRequest $request, string $id)
    {
        Gate::authorize('ge:write');

        $this->service->updateBattery($request->validated(), $id);
        return response(["message" => "Bateria atualizada com sucesso!"], 200);
    }

    public function destroy(Request $request)
    {
        Gate::authorize('ge:write');

        $this->service->disableBattery($request->ids);
        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
