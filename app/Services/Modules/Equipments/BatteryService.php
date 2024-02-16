<?php

namespace App\Services\Modules\Equipments;

use App\Repositories\Modules\Equipments\BatteryRepository;

class BatteryService
{
    function __construct(BatteryRepository $repository)
    {
        $this->repository = $repository;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->repository->pagination($limit, $orderBy, $filter, $page, $search);
    }

    public function createBattery(array $data)
    {
        foreach ($data as $key => $value) {

            if ($key != "image" && $key != "enable" && $key != "last_charge") {
                $data_formatted["battery"][$key] = $value;
            } else if ($key == "last_charge") {
                $data_formatted["battery"][$key] = date("Y-m-d H:i:s", strtotime($value));
            } else if ($key == "image") {

                if (is_file($value)) {
                    $image_content = file_get_contents($data['image']);
                    $filename = time() . ".jpeg";

                    $image_path = getTenantUUID() . "/images/batteries/" . $filename;
                    $data_formatted["image"]["content"] = $image_content;

                    $data_formatted["battery"]["image_path"] = $image_path;
                } else {
                    throw new \Exception("Arquivo de imagem não encontrado.");
                }
            }
            
        }

        $data_formatted["battery"]["tenant_id"] = session("tenant_id");

        $battery = $this->repository->createBattery(collect($data_formatted));
    }

    public function updateBattery(array $data, string $id)
    {
        $save_image = false;
        foreach ($data as $key => $value) {

            if ($key != "image" && $key != "enable" && $key != "last_charge") {
                $data_formatted["battery"][$key] = $value;
            } else if ($key == "last_charge") {
                $data_formatted["battery"][$key] = date("Y-m-d H:i:s", strtotime($value));
            } else if ($key == "image") {

                if (is_file($value)) {
                    $save_image = true;

                    $image_content = file_get_contents($data['image']);
                    $filename = time() . ".jpeg";
                    $image_path = getTenantUUID() . "/images/batteries/" . $filename;

                    $data_formatted["image"]["content"] = $image_content;
                    $data_formatted["image"]["path"] = $image_path;

                    $data_formatted["battery"]["image_path"] = $image_path;
                }
            }
        }

        $data_formatted["image"]["exists"] = $save_image;
        $data_formatted["enable"] = $data["enable"];

        $battery = $this->repository->updateBattery(collect($data_formatted), $id);
    }

    public function disableBattery(array $ids)
    {
        $battery = $this->repository->disableBattery($ids);
    }
}
