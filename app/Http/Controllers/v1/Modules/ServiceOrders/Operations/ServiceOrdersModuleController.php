<?php

namespace App\Http\Controllers\v1\Modules\ServiceOrders\Operations;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\Modules\ServiceOrders\Services\ServiceOrdersModuleResource;
use App\Services\Modules\ServiceOrders\ServiceOrderService;
use App\Http\Requests\Modules\ServiceOrders\Services\CreateServiceOrderRequest;

class ServiceOrdersModuleController extends Controller
{
    function __construct(ServiceOrderService $service)
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
        $filter = request()->filter;

        $payload = $this->service->pagination($limit, $orderBy, $filter, $page, $search);

        return response(new ServiceOrdersModuleResource($payload), 200);
    }

    public function store(CreateServiceOrderRequest $request)
    {
        Gate::authorize('gos:write');

        $this->service->createServiceOrder($request->validated());
        return response(["message" => "Ordem de serviço criada com sucesso!"], 201);
    }

    public function update(CreateServiceOrderRequest $request, string $id)
    {
        Gate::authorize('gos:write');

        $this->service->updateServiceOrder($request->validated(), $id);
        return response(["message" => "Ordem de serviço atualizada com sucesso!"], 200);
    }
}
