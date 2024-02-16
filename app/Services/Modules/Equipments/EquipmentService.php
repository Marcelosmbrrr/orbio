<?php

namespace App\Services\Modules\Equipments;

use App\Repositories\Modules\Equipments\EquipmentRepository;

class EquipmentService
{
    function __construct(EquipmentRepository $repository)
    {
        $this->repository = $repository;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->repository->pagination($limit, $orderBy, $filter, $page, $search);
    }

    public function createEquipment(array $data)
    {
        $save_image = false;
        foreach ($data as $key => $value) {

            if ($key != "image") {
                $data_formatted["equipment"][$key] = $value;
            } else if ($key == "image") {

                if (is_file($value)) {
                    $image_content = file_get_contents($data['image']);
                    $filename = time() . ".jpeg";

                    $image_path = getTenantUUID() . "/images/equipments/" . $filename;
                    $data_formatted["image"]["content"] = $image_content;

                    $data_formatted["equipment"]["image_path"] = $image_path;
                } else {
                    throw new \Exception("Arquivo de imagem não encontrado.");
                }
            }
        }

        $data_formatted["image"]["exists"] = $save_image;
        $data_formatted["equipment"]["tenant_id"] = session("tenant_id");

        $equipment = $this->repository->createEquipment(collect($data_formatted));
    }

    public function updateEquipment(array $data, string $id)
    {
        $save_image = false;
        foreach ($data as $key => $value) {

            if ($key != "image" && $key != "enable") {
                $data_formatted["equipment"][$key] = $value;
            } else if ($key == "image") {

                if (is_file($value)) {
                    $save_image = true;

                    $image_content = file_get_contents($data['image']);
                    $filename = time() . ".jpeg";
                    $image_path = getTenantUUID() . "/images/equipments/" . $filename;

                    $data_formatted["image"]["content"] = $image_content;
                    $data_formatted["image"]["path"] = $image_path;

                    $data_formatted["equipment"]["image_path"] = $image_path;
                }
            }
        }

        $data_formatted["image"]["exists"] = $save_image;
        $data_formatted["enable"] = $data["enable"];

        $equipment = $this->repository->updateEquipment(collect($data_formatted), $id);
    }

    public function disableEquipment(array $ids)
    {
        $equipment = $this->repository->disableEquipment($ids);
    }
}
