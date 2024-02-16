<?php

namespace App\Repositories\Modules\Equipments;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\Equipments\Equipment;

class EquipmentRepository
{
    function __construct(Equipment $model)
    {
        $this->model = $model;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->model
            ->where("tenant_id", session("tenant_id"))
            ->filter($filter) // scope
            ->search($search) // scope
            ->orderBy($orderBy[0], $orderBy[1])
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'equipments', (int) $page);
    }

    public function createEquipment(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $equipment = $this->model->create($data->get("equipment"));

            if (!Storage::disk('public')->exists($data->get("equipment")["image_path"])) {
                Storage::disk('public')->put($data->get("equipment")["image_path"], $data->get('image')["content"]);
            }

            return $equipment;
        });
    }

    public function updateEquipment(Collection $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $equipment = $this->model->withTrashed()->findOrFail($id);
            $equipment->update($data->get('equipment'));

            if ($data->get("image")["exists"]) {

                // delete previously
                if (Storage::disk('public')->exists($equipment->image_path)) {
                    Storage::disk('public')->delete($equipment->image_path);
                }

                $equipment->update([
                    "image_path" => $data->get("image")["path"]
                ]);

                if (!Storage::disk('public')->exists($data->get("image")["path"])) {
                    Storage::disk('public')->put($data->get("image")["path"], $data->get('image')["content"]);
                }
            }

            return $equipment;
        });
    }

    public function disableEquipment(array $ids)
    {
        return DB::transaction(function () use ($ids) {

            $equipments = $this->model->findMany($ids);

            foreach ($equipments as $equipment) {

                $related_service_orders_are_finished = $equipment->service_orders->every(function ($service_order) {
                    return $service_order->report()->exists();
                });

                if (!$related_service_orders_are_finished) {
                    throw new \Exception("Erro! Drones vinculados a ordens de serviço não finalizadas não podem ser deletados.", 409);
                }
            }

            foreach ($equipments as $equipment) {
                $equipment->delete();
            }

            return $equipments;
        });
    }
}
