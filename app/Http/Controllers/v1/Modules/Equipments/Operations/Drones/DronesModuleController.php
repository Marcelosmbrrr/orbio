<?php

namespace App\Http\Controllers\v1\Modules\Equipments\Operations\Drones;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Modules\Equipments\Drones\CreateDroneRequest;
use App\Http\Requests\Modules\Equipments\Drones\EditDroneRequest;
use App\Services\Modules\Equipments\DroneService;
use App\Http\Resources\Modules\Equipments\DronesModuleResource;

class DronesModuleController extends Controller
{
    function __construct(DroneService $service)
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

        return response(new DronesModuleResource($payload), 200);
    }

    public function store(CreateDroneRequest $request)
    {
        Gate::authorize('ge:write');

        $this->service->createDrone($request->validated());
        return response(["message" => "Drone criado com sucesso!"], 201);
    }

    public function update(EditDroneRequest $request, string $id)
    {
        Gate::authorize('ge:write');

        $this->service->updateDrone($request->validated(), $id);
        return response(["message" => "Drone atualizado com sucesso!"], 200);
    }

    public function destroy(Request $request)
    {
        Gate::authorize('ge:write');

        $this->service->disableDrone($request->ids);
        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
