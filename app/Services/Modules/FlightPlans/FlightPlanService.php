<?php

namespace App\Services\Modules\FlightPlans;

use App\Repositories\Modules\FlightPlans\FlightPlanRepository;
use Illuminate\Support\Facades\Http;

class FlightPlanService
{

    function __construct(FlightPlanRepository $repository)
    {
        $this->repository = $repository;
    }

    public function pagination(string $limit, array $orderBy, string $filter, string $page, string $search)
    {
        return $this->repository->pagination($limit, $orderBy, $filter, $page, $search);
    }

    public function createFlightPlan(array $data)
    {
        if (is_null($data["route_files"]) || is_null($data["imageDataURL"])) {
            throw new \Exception("Erro na criação do plano de voo.", 400);
        }

        // Flight plan name
        $data_formatted["name"] = $data["name"];

        // Path foldername as timestamp
        $pathTimestamp =  $data["timestamp"];

        $storagePath = getTenantUUID() . "/flight_plans/$pathTimestamp";
        $data_formatted["file_path"] = $storagePath;

        // Single file
        $singleFileName = $data["single_file"]->getClientOriginalName();
        $contents = file_get_contents($data["single_file"]);
        $data_formatted["single_file"] = [
            "contents" => $contents,
            "filename" => $singleFileName,
            "path" => "$storagePath/single/$singleFileName"
        ];

        // Multi files
        foreach ($data["route_files"] as $index => $route_file) {
            $filename = $route_file->getClientOriginalName();
            $contents = file_get_contents($route_file);
            $path = "$storagePath/multi/$filename";

            $data_formatted["route_files"][$index] = [
                "contents" => $contents,
                "filename" => $filename,
                "path" => $path
            ];
        }

        // Img file
        $img = str_replace('data:image/jpeg;base64,', '', $data["imageDataURL"]);
        $img = str_replace(' ', '+', $img);

        $data_formatted["image"] = [
            "path" => getTenantUUID() . "/images/flight_plans/" . $data["imageFilename"],
            "contents" => base64_decode($img)
        ];

        // Get location
        $data_formatted["coordinates"] = $data["coordinates"][0];
        $address = Http::get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" . $data_formatted["coordinates"] . "&key=" . env("GEOCODING_API_KEY"))["results"][0]["address_components"];
        $data_formatted["city"] = $address[2]["long_name"];
        $data_formatted["state"] = strlen($address[3]["short_name"]) === 2 ? $address[3]["short_name"] : $address[4]["short_name"];

        $flight_plan = $this->repository->createFlightPlan(collect($data_formatted));
    }

    public function updateFlightPlan(array $data, string $id)
    {
        $flight_plan = $this->repository->updateFlightPlan(collect($data), $id);
    }

    public function deleteFlightPlan(array $ids)
    {
        $flight_plan = $this->repository->deleteFlightPlan($ids);
    }
}
