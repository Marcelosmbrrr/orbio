<?php

namespace App\Http\Controllers\v1\Modules\PersonsRoles\Operations;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Modules\PersonsRoles\Roles\CreateRoleRequest;
use App\Http\Requests\Modules\PersonsRoles\Roles\EditRoleRequest;
use App\Services\Modules\PersonsRoles\RolesTenantService;
use App\Http\Resources\Modules\PersonsRoles\RolesTenantResource;

class RolesTenantController extends Controller
{
    function __construct(RolesTenantService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        Gate::authorize('gpc:read');

        $limit = request()->limit;
        $page = request()->page;
        $search = request()->search ?? "";
        $orderBy = explode(",", request()->order);
        $filter = request()->filter;

        $payload = $this->service->pagination($limit, $orderBy, $filter, $page, $search);

        return response(new RolesTenantResource($payload), 200);
    }

    public function store(CreateRoleRequest $request)
    {
        Gate::authorize('gpc:write');

        $this->service->createRole($request->validated());
        return response(["message" => "Cargo criado com sucesso!"], 201);
    }

    public function update(EditRoleRequest $request, string $id)
    {
        Gate::authorize('gpc:write');

        $this->service->updateRole($request->validated(), $id);
        return response(["message" => "Cargo atualizado com sucesso!"], 200);
    }

    public function destroy(Request $request)
    {
        Gate::authorize('gpc:write');

        $this->service->disableRole($request->ids);
        return response(["message" => "Cargo deletado com sucesso!"], 200);
    }
}
