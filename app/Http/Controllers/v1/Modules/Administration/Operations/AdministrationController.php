<?php

namespace App\Http\Controllers\v1\Modules\Administration\Operations;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Modules\Administration\CreateTenantRequest;
use App\Http\Requests\Modules\Administration\EditTenantRequest;
use App\Services\Modules\Administration\AdministrationService;
use App\Http\Resources\Modules\Administration\AdministrationResource;

class AdministrationController extends Controller
{
    function __construct(AdministrationService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        Gate::authorize('gadmin:read');

        $limit = request()->limit;
        $page = request()->page;
        $search = request()->search ?? "";
        $orderBy = explode(",", request()->order);
        $filter = request()->filter;

        $payload = $this->service->pagination($limit, $orderBy, $filter, $page, $search);

        return response(new AdministrationResource($payload), 200);
    }

    public function store(CreateTenantRequest $request)
    {
        Gate::authorize('gadmin:write');
       
        $this->service->createTenant($request->validated());
        return response(["message" => "Gerente criado com sucesso!"], 201);
    }

    public function update(EditTenantRequest $request, string $id)
    {
        Gate::authorize('gadmin:write');
     
        $this->service->updateTenant($request->validated(), $id);
        return response(["message" => "Gerente atualizado com sucesso!"], 200);
    }

    public function destroy(Request $request)
    {
        Gate::authorize('gadmin:write');

        $this->service->deleteTenant($request->ids);
        return response(["message" => "Gerente deletado com sucesso!"], 200);
    }
}
