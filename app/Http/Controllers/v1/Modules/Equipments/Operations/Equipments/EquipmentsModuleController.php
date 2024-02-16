<?php

namespace App\Http\Controllers\v1\Modules\Equipments\Operations\Equipments;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Services\Modules\Equipments\EquipmentService;
use App\Http\Resources\Modules\Equipments\EquipmentsModuleResource;
use App\Http\Requests\Modules\Equipments\Equipments\CreateEquipmentRequest;
use App\Http\Requests\Modules\Equipments\Equipments\EditEquipmentRequest;

class EquipmentsModuleController extends Controller
{
    function __construct(EquipmentService $service)
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

        return response(new EquipmentsModuleResource($payload), 200);
    }

    public function store(CreateEquipmentRequest $request)
    {
        Gate::authorize('ge:write');

        $this->service->createEquipment($request->validated());
        return response(["message" => "Equipamento criado com sucesso!"], 201);
    }

    public function update(EditEquipmentRequest $request, string $id)
    {
        Gate::authorize('ge:write');

        $this->service->updateEquipment($request->validated(), $id);
        return response(["message" => "Equipamento atualizado com sucesso!"], 200);
    }

    public function destroy(Request $request)
    {
        Gate::authorize('ge:write');

        $this->service->disableEquipment($request->ids);
        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
