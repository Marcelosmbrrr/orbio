<?php

namespace App\Http\Controllers\v1\Modules\FlightPlans\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Modules\FlightPlans\EditFlightPlanRequest;
use App\Models\Modules\FlightPlans\FlightPlan;

class UpdateFlightPlanRouteController extends Controller
{
    public function __construct(FlightPlan $model)
    {
        $this->model = $model;
    }

    public function __invoke(EditFlightPlanRequest $request, string $id)
    {
        Gate::authorize('gpv:write');

        $data = $request->all();

        if (is_null($data["route_files"]) || is_null($data["imageDataURL"])) {
            throw new \Exception("Erro na criação do plano de voo.", 500);
        }

        // Path foldername as timestamp
        $pathTimestamp =  $data["timestamp"];
        $storagePath = "flight_plans/$pathTimestamp";

        // Single file
        $singleFileName = $data["single_file"]->getClientOriginalName();
        $singleFileContents = file_get_contents($data["single_file"]);
        $singleFilePath = "$storagePath/single/$singleFileName";

        // Multi files
        foreach ($data["route_files"] as $index => $route_file) {
            $filename = $route_file->getClientOriginalName();
            $contents = file_get_contents($route_file);
            $path = "$storagePath/multi/$filename";

            $route_files[$index] = [
                "contents" => $contents,
                "filename" => $filename,
                "path" => $path
            ];
        }

        // Img file
        $img = str_replace('data:image/jpeg;base64,', '', $data["imageDataURL"]);
        $img = str_replace(' ', '+', $img);
        $imagePath = "images/flight_plans/" . $data["imageFilename"];
        $imageContents = base64_decode($img);

        // Get location
        $coordinates = $data["coordinates"][0];
        $address = Http::get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" . $coordinates . "&key=" . env("GEOCODING_API_KEY"))["results"][0]["address_components"];
        $city = $address[2]["long_name"];
        $state = strlen($address[3]["short_name"]) === 2 ? $address[3]["short_name"] : $address[4]["short_name"];

        // Update flight plan record

        $flight_plan = $this->model->withTrashed()->findOrFail($id);
        $flight_plan->update([
            "name" => $data["name"],
            "city" => $city,
            "state" => $state,
            "file_path" => $storagePath,
            "coordinates" => $coordinates,
            "image_path" => $imagePath
        ]);

        // Delete all actual files - routes and image
        Storage::disk('public')->deleteDirectory($flight_plan->file_path);
        Storage::disk('public')->delete($flight_plan->image_path);

        // Save single file
        Storage::disk('public')->put($singleFilePath, $singleFileContents);
        // Save multi files
        foreach ($route_files as $route_file) {
            Storage::disk('public')->put($route_file["path"], $route_file["contents"]);
        }
        // Save image
        Storage::disk('public')->put($imagePath, $imageContents);

        return response(["message" => "Plano de voo atualizado com sucesso!"], 200);
    }
}
