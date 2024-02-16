<?php

namespace App\Services\Modules\ServiceOrders;

use App\Repositories\Modules\ServiceOrders\LogRepository;

class LogService
{
    function __construct(LogRepository $repository)
    {
        $this->repository = $repository;
    }

    public function pagination(string $limit, array $orderBy, string $page, string $search)
    {
        return $this->repository->pagination($limit, $orderBy, $page, $search);
    }

    public function createLog(array $data, string $service_order_id)
    {
        $data_formatted = [];

        foreach ($data as $index => $log) {

            $name_without_extension = explode(".", $log["filename"])[0];
            $log_path = null;
            $image_path = null;

            $log_path = getTenantUUID() . "/logs/{$log["filename"]}";
            $image_path = getTenantUUID() . "/images/logs/$name_without_extension.jpg";

            $img = str_replace('data:image/jpeg;base64,', '', $log["imageDataURL"]);
            $img = str_replace(' ', '+', $img);
            $img_path = getTenantUUID() . "/images/logs/$name_without_extension.jpg";

            $data_formatted["storage"]["images"][$index] = [
                "contents" => base64_decode($img),
                "path" => $img_path
            ];

            $data_formatted["storage"]["logs"][$index] = [
                "contents" => $log["contents"],
                "path" => $log_path
            ];

            $data_formatted["logs"][$index]["name"] = $name_without_extension;
            $data_formatted["logs"][$index]["service_order_id"] = $service_order_id;
            $data_formatted["logs"][$index]["filename"] = $log["filename"];
            $data_formatted["logs"][$index]["log_path"] = $log_path;
            $data_formatted["logs"][$index]["image_path"] = $image_path;
            $data_formatted["logs"][$index]["coordinates"] = $log["coordinates"];
            $data_formatted["logs"][$index]["city"] = $log["city"];
            $data_formatted["logs"][$index]["state"] = $log["state"];
        }

        $logs = $this->repository->createLog(collect($data_formatted));
    }
}
