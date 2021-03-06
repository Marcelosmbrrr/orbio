<?php

namespace App\Http\Controllers\Modules\Incident;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
// Custom
use App\Models\Incidents\IncidentModel;
use App\Http\Requests\Modules\Incidents\IncidentStoreRequest;
use App\Http\Requests\Modules\Incidents\IncidentUpdateRequest;
use App\Services\Modules\Incident\IncidentService;

class IncidentModuleController extends Controller
{

    private IncidentService $service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\Modules\Incident\IncidentService $service
     */
    public function __construct(IncidentService $service){
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() : \Illuminate\Http\Response
    {
        Gate::authorize('incidents_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        return $this->service->loadIncidentsWithPagination($limit, $actual_page, $where_value);
 
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  App\Http\Requests\Modules\Incidents\IncidentStoreRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(IncidentStoreRequest $request) : \Illuminate\Http\Response
    {
        Gate::authorize('incidents_write');

        return $this->service->createIncident($request);

    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) : \Illuminate\Http\Response
    {
        Gate::authorize('incidents_read');

        $args = explode(".", request()->args);
        $limit = (int) $args[0];
        $where_value = $args[1];
        $actual_page = (int) $args[2];

        return $this->service->loadIncidentsWithPagination($limit, $actual_page, $where_value);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param App\Http\Requests\Modules\Incidents\IncidentUpdateRequest  $request
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function update(IncidentUpdateRequest $request, $id) : \Illuminate\Http\Response
    {
        Gate::authorize('incidents_write');

        return $this->service->updateIncident($request, $id);
  
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) : \Illuminate\Http\Response
    {
        Gate::authorize('incidents_write');

        return $this->service->deleteIncident($id); 
 
    }
}
