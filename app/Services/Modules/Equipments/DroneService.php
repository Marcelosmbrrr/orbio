<?php

namespace App\Services\Modules\Equipments;

use App\Repositories\Modules\Equipments\DroneRepository;

class DroneService
{
    function __construct(DroneRepository $repository)
    {
        $this->repository = $repository;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->repository->pagination($limit, $orderBy, $filter, $page, $search);
    }

    public function createDrone(array $data)
    {
        $image_path = null;
        foreach ($data as $key => $value) {

            if ($key != "image") {
                $data_formatted["drone"][$key] = $value;
            } else if ($key == "image") {

                if (is_file($value)) {
                    $image_content = file_get_contents($data['image']);
                    $filename = time() . ".jpeg";

                    $image_path = getTenantUUID() . "/images/drones/" . $filename;
                    $data_formatted["image"]["content"] = $image_content;

                    $data_formatted["drone"]["image_path"] = $image_path;
                } else {
                    throw new \Exception("Arquivo de imagem não encontrado.");
                }
            }
            
        }

        $data_formatted["drone"]["tenant_id"] = session("tenant_id");

        $drone = $this->repository->createDrone(collect($data_formatted));
    }

    public function updateDrone(array $data, string $id)
    {
        $save_image = false;
        foreach ($data as $key => $value) {

            if ($key != "image" && $key != "enable") {
                $data_formatted["drone"][$key] = $value;
            } else if ($key == "image") {

                if (is_file($value)) {
                    $save_image = true;

                    $image_content = file_get_contents($data['image']);
                    $filename = time() . ".jpeg";
                    $image_path = getTenantUUID() . "/images/drones/" . $filename;

                    $data_formatted["image"]["content"] = $image_content;
                    $data_formatted["image"]["path"] = $image_path;

                    $data_formatted["drone"]["image_path"] = $image_path;
                }
            }
        }

        $data_formatted["image"]["exists"] = $save_image;
        $data_formatted["enable"] = $data["enable"];

        $drone = $this->repository->updateDrone(collect($data_formatted), $id);
    }

    public function disableDrone(array $ids)
    {
        $drone = $this->repository->disableDrone($ids);
    }
}
