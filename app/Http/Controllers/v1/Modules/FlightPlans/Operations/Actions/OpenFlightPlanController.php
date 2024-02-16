<?php

namespace App\Http\Controllers\v1\Modules\FlightPlans\Operations\Actions;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\FlightPlans\FlightPlan;

class OpenFlightPlanController extends Controller
{
    public function __invoke(string $id)
    {
        Gate::authorize('gpv:read');

        $flight_plan = FlightPlan::find($id);

        if (!$flight_plan) {
            throw new \Exception("Plano de voo não encontrado!", 404);
        }

        if (!Storage::disk("public")->exists($flight_plan->file_path . "/single")) {
            throw new \Exception("Erro! O arquivo não foi encontrado.", 404);
        }

        $folder_file = Storage::disk("public")->files($flight_plan->file_path . "/single");
        $file_contents = Storage::disk("public")->get($folder_file[0]);

        return response(["contents" => $file_contents])->withHeaders([
            "Content-type" => "application/json"
        ], 200);
    }
}
