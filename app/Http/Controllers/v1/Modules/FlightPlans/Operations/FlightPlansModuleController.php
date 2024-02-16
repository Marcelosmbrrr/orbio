<?php

namespace App\Http\Controllers\v1\Modules\FlightPlans\Operations;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use App\Services\Modules\FlightPlans\FlightPlanService;
use App\Http\Resources\Modules\FlightPlans\FlightPlansModuleResource;
use App\Http\Requests\Modules\FlightPlans\CreateFlightPlanRequest;

class FlightPlansModuleController extends Controller
{
    function __construct(FlightPlanService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        Gate::authorize('gpv:read');

        $limit = request()->limit;
        $page = request()->page;
        $search = request()->search ?? "";
        $orderBy = explode(",", request()->order);
        $filter = request()->filter;

        $payload = $this->service->pagination($limit, $orderBy, $filter, $page, $search);

        return response(new FlightPlansModuleResource($payload), 200);
    }

    public function store(CreateFlightPlanRequest $request)
    {
        Gate::authorize('gpv:write');

        $this->service->createFlightPlan($request->all());
        return response(["message" => "Plano de voo criado com sucesso!"], 201);
    }

    public function update(Request $request, string $id)
    {
        Gate::authorize('gpv:write');

        $this->service->updateFlightPlan($request->all(), $id);
        return response(["message" => "Plano de voo atualizado com sucesso!"], 200);
    }

    public function destroy(Request $request)
    {
        Gate::authorize('gpv:write');

        $this->service->deleteFlightPlan($request->ids);
        return response(["message" => "Deleção realizada com sucesso!"], 200);
    }
}
