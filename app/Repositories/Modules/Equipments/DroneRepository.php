<?php

namespace App\Repositories\Modules\Equipments;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\Equipments\Drone;

class DroneRepository
{
    function __construct(Drone $model)
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
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'drones', (int) $page);
    }

    public function createDrone(Collection $data)
    {
        return DB::transaction(function () use ($data) {
            $drone = $this->model->create($data->get("drone"));

            if (!Storage::disk('public')->exists($data->get("drone")["image_path"])) {
                Storage::disk('public')->put($data->get("drone")["image_path"], $data->get('image')["content"]);
            }

            return $drone;
        });
    }

    public function updateDrone(Collection $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $drone = $this->model->withTrashed()->findOrFail($id);
            $drone->update($data->get('drone'));

            if ($data->get("image")["exists"]) {

                // delete previously
                if (Storage::disk('public')->exists($drone->image_path)) {
                    Storage::disk('public')->delete($drone->image_path);
                }

                $drone->update([
                    "image_path" => $data->get("image")["path"]
                ]);

                if (!Storage::disk('public')->exists($data->get("image")["path"])) {
                    Storage::disk('public')->put($data->get("image")["path"], $data->get('image')["content"]);
                }
            }

            return $drone;
        });
    }

    public function disableDrone(array $ids)
    {
        return DB::transaction(function () use ($ids) {

            $drones = $this->model->findMany($ids);

            foreach ($drones as $drone) {

                $related_service_orders_are_finished = $drone->service_orders->every(function ($service_order) {
                    return $service_order->report()->exists();
                });

                if (!$related_service_orders_are_finished) {
                    throw new \Exception("Erro! Drones vinculados a ordens de serviço não finalizadas não podem ser deletados.", 409);
                }
            }

            foreach ($drones as $drone) {
                $drone->delete();
            }

            return $drones;

        });
    }
}
