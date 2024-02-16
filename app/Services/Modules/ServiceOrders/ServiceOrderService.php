<?php

namespace App\Services\Modules\ServiceOrders;

use App\Repositories\Modules\ServiceOrders\ServiceOrderRepository;

class ServiceOrderService
{
    function __construct(ServiceOrderRepository $repository)
    {
        $this->repository = $repository;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->repository->pagination($limit, $orderBy, $filter, $page, $search);
    }

    public function createServiceOrder(array $data)
    {
        $data["tenant_id"] = session("tenant_id");
        $service_order = $this->repository->createServiceOrder(collect($data));
    }

    public function updateServiceOrder(array $data, $id)
    {
        $service_order = $this->repository->updateServiceOrder(collect($data), $id);
    }
}
