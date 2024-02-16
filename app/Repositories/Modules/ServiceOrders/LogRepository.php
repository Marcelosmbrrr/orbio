<?php

namespace App\Repositories\Modules\ServiceOrders;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\ServiceOrders\Log;

class LogRepository
{
    function __construct(Log $model)
    {
        $this->model = $model;
    }

    public function pagination(string $limit, array $orderBy, string $page, string $search)
    {
        return $this->model->with(["user"])
            ->search($search) // scope
            ->orderBy($orderBy[0], $orderBy[1])
            ->paginate((int) $limit, $columns = ['*'], $pageName = 'logs', (int) $page);
    }

    public function createLog(Collection $data)
    {
        return DB::transaction(function () use ($data) {

            $logs = $this->model->insert($data->get("logs"));

            foreach ($data->get('storage')['logs'] as $log) {
                Storage::disk('public')->put($log["path"], $log["contents"]);
            }

            foreach ($data->get('storage')['images'] as $image) {
                Storage::disk('public')->put($image["path"], $image["contents"]);
            }

            return $logs;
        });


        $log = $this->model->create($data);
        return $log;
    }
}
