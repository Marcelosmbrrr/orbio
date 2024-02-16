<?php

namespace App\Repositories\Modules\Equipments;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\Equipments\Battery;

class BatteryRepository
{
    function __construct(Battery $model)
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
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'batteries', (int) $page);
    }

    public function createBattery(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $battery = $this->model->create($data->get("battery"));

            if (!Storage::disk('public')->exists($data->get("battery")["image_path"])) {
                Storage::disk('public')->put($data->get("battery")["image_path"], $data->get('image')["content"]);
            }

            return $battery;
        });
    }

    public function updateBattery(Collection $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $battery = $this->model->withTrashed()->findOrFail($id);
            $battery->update($data->get('battery'));

            if ($data->get("image")["exists"]) {

                // delete previously
                if (Storage::disk('public')->exists($battery->image_path)) {
                    Storage::disk('public')->delete($battery->image_path);
                }

                $battery->update([
                    "image_path" => $data->get("image")["path"]
                ]);

                if (!Storage::disk('public')->exists($data->get("image")["path"])) {
                    Storage::disk('public')->put($data->get("image")["path"], $data->get('image')["content"]);
                }
            }

            return $battery;
        });
    }

    public function disableBattery(array $ids)
    {
        return DB::transaction(function () use ($ids) {

           $batteries = $this->model->findMany($ids);

            foreach ($batteries as $battery) {

                $related_service_orders_are_finished = $battery->service_orders->every(function ($service_order) {
                    return $service_order->report()->exists();
                });

                if (!$related_service_orders_are_finished) {
                    throw new \Exception("Erro! Drones vinculados a ordens de serviço não finalizadas não podem ser deletados.", 409);
                }
            }

            foreach ($batteries as $battery) {
                $battery->delete();
            }

            return $batteries;
        });
    }
}
