<?php

namespace App\Repositories\Modules\ServiceOrders;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Models\Modules\ServiceOrders\ServiceOrder;

class ServiceOrderRepository
{
    function __construct(ServiceOrder $serviceOrderModel)
    {
        $this->serviceOrderModel = $serviceOrderModel;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->serviceOrderModel->with(['users', 'drones', 'batteries', 'equipments', 'flight_plans', 'logs', 'incidents'])
            ->where("tenant_id", session("tenant_id"))
            ->filterGroup($filter) // scope
            ->search($search) // scope
            ->orderBy($orderBy[0], $orderBy[1])
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'orders', (int) $page);
    }

    public function createServiceOrder(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $service_order = $this->serviceOrderModel->create([
                "number" => "os." . time(),
                'tenant_id' => session('tenant_id'),
            ]);

            // Relationships

            if ((bool) $data->get("pilot")) {
                $service_order->users()->attach($data->get("pilot")[0], ["role_in" => "pilot"]);
            }

            if ((bool) $data->get("client")) {
                $service_order->users()->attach($data->get("client")[0], ["role_in" => "client"]);
            }

            if ((bool) $data->get("flight_plans")) {
                $service_order->flight_plans()->attach($data->get("flight_plans"));
            }

            if ((bool) $data->get("drones")) {
                $service_order->drones()->attach($data->get("drones"));
            }

            if ((bool) $data->get("batteries")) {
                $service_order->batteries()->attach($data->get("batteries"));
            }

            if ((bool) $data->get("equipments")) {
                $service_order->equipments()->attach($data->get("equipments"));
            }

            return $service_order;
        });
    }

    public function updateServiceOrder(Collection $data, string $id)
    {
        return DB::transaction(function () use ($data, $id) {

            $service_order = $this->serviceOrderModel->find($id);

            // Relationships

            $service_order->users()->detach();
            $service_order->flight_plans()->detach();
            $service_order->drones()->detach();
            $service_order->batteries()->detach();
            $service_order->equipments()->detach();

            if ((bool) $data->get("pilot")) {
                $service_order->users()->attach($data->get("pilot")[0], ["role_in" => "pilot"]);
            }

            if ((bool) $data->get("client")) {
                $service_order->users()->attach($data->get("client")[0], ["role_in" => "client"]);
            }

            if ((bool) $data->get("flight_plans")) {
                $service_order->flight_plans()->attach($data->get("flight_plans"));
            }

            if ((bool) $data->get("drones")) {
                $service_order->drones()->attach($data->get("drones"));
            }

            if ((bool) $data->get("batteries")) {
                $service_order->batteries()->attach($data->get("batteries"));
            }

            if ((bool) $data->get("equipments")) {
                $service_order->equipments()->attach($data->get("equipments"));
            }

            return $service_order;
        });
    }
}
