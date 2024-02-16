<?php

namespace App\Http\Controllers\v1\Modules\FlightPlans\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\FlightPlans\FlightPlan;

class ExportFlightPlanController extends Controller
{
    function __construct(FlightPlan $flightPlanModel)
    {
        $this->model = $flightPlanModel;
    }

    public function __invoke(string $flight_plan_id)
    {
        Gate::authorize('gpv:read');

        $flight_plan = $this->model->find($flight_plan_id);

        $single_file_path = Storage::disk("public")->files($flight_plan->file_path . "/single");
        $single_filename = explode(".", explode("/", $single_file_path[0])[3])[0];
        $single_file_content = Storage::disk("public")->get($single_file_path[0]);

        $multi_files_paths = Storage::disk("public")->files($flight_plan->file_path . "/multi");
        $multi_files_content = [];

        foreach ($multi_files_paths as $file_path) {

            if (!$file_contents = Storage::disk("public")->get($file_path)) {
                throw new \Exception("Erro! O arquivo não foi encontrado.", 404);
            }

            $filename = explode(".", explode("/", $file_path)[3])[0];
            $multi_files_content[$filename] = $file_contents;
        }

        $payload = [
            "single" => [
                $single_filename => $single_file_content
            ],
            "multi" => $multi_files_content
        ];

        return response($payload)->withHeaders([
            "Content-type" => "application/json"
        ]);
    }
}
