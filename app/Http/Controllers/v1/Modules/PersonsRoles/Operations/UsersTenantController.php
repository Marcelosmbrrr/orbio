<?php

namespace App\Http\Controllers\v1\Modules\PersonsRoles\Operations;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Modules\PersonsRoles\Users\CreateUserRequest;
use App\Http\Requests\Modules\PersonsRoles\Users\EditUserRequest;
use App\Services\Modules\PersonsRoles\UsersTenantService;
use App\Http\Resources\Modules\PersonsRoles\UsersTenantResource;

class UsersTenantController extends Controller
{
    function __construct(UsersTenantService $service)
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

        return response(new UsersTenantResource($payload), 200);
    }

    public function store(CreateUserRequest $request)
    {
        Gate::authorize('gpc:write');
        
        $this->service->createUser($request->validated());
        return response(["message" => "Usuário criado com sucesso!"], 201);
    }

    public function update(EditUserRequest $request, string $id)
    {
        Gate::authorize('gpc:write');

        $this->service->updateUser($request->validated(), $id);
        return response(["message" => "Usuário atualizado com sucesso!"], 200);
    }

    public function destroy(Request $request)
    {
        Gate::authorize('gpc:write');

        $this->service->deleteUser($request->ids);
        return response(["message" => "Usuário deletado com sucesso!"], 200);
    }
}
