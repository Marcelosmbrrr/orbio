<?php

namespace App\Repositories\Modules\FlightPlans;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\FlightPlans\FlightPlan;

class FlightPlanRepository
{
    function __construct(FlightPlan $model)
    {
        $this->model = $model;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->model
            ->where('tenant_id', session('tenant_id'))
            ->filter($filter) // scope
            ->search($search) // scope
            ->orderBy($orderBy[0], $orderBy[1])
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'plans', (int) $page);
    }

    public function createFlightPlan(Collection $data)
    {
        foreach ($data["route_files"] as $flight_file) {
            if (Storage::disk('public')->exists($flight_file["path"])) {
                throw new \Exception("Erro! Esse plano de voo já existe.", 409);
            }
        }

        return DB::transaction(function () use ($data) {

            $flight_plan = $this->model->create([
                "name" => $data["name"],
                "tenant_id" => session("tenant_id"),
                "city" => $data["city"],
                "state" => $data["state"],
                "file_path" => $data["file_path"],
                "coordinates" => $data["coordinates"],
                "image_path" => $data["image"]["path"]
            ]);

            foreach ($data["route_files"] as $route_file) {
                Storage::disk('public')->put($route_file["path"], $route_file["contents"]);
            }
            Storage::disk('public')->put($data["single_file"]["path"], $data["single_file"]["contents"]);
            Storage::disk('public')->put($data["image"]["path"], $data["image"]["contents"]);

            return $flight_plan;
        });
    }

    public function updateFlightPlan(Collection $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $flight_plan = $this->model->withTrashed()->findOrFail($id);

            $flight_plan->update([
                "name" => $data->get("name")
            ]);

            $flight_plan->refresh();

            return $flight_plan;
        });
    }

    public function deleteFlightPlan(array $ids)
    {
        return DB::transaction(function () use ($ids) {

            $flight_plans = $this->model->findMany($ids);

            foreach ($flight_plans as $flight_plan) {

                if ($flight_plan->service_orders()->exists()) {

                    $related_service_orders_are_inative = $flight_plan->service_orders->every(function ($service_order) {
                        return (bool) !$service_order->status;
                    });

                    if (!$related_service_orders_are_inative) {
                        throw new \Exception("Erro! Planos vinculados a serviços ativos não podem ser deletados.", 409);
                    }
                }
            }

            foreach ($flight_plans as $flight_plan) {
                $flight_plan->delete();
            }

            return  $flight_plans;
        });
    }
}
