<?php

namespace App\Http\Resources\Modules\ServiceOrders\Services;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Storage;
use App\Models\Modules\ServiceOrders\ServiceOrder;

class ServiceOrdersModuleResource extends ResourceCollection
{
    private array $payload = [];

    public function toArray(Request $request): array
    {
        $this->payload["services"] = [];

        foreach ($this->collection as $index => $service_order) {

            // Related persons

            $persons = [
                "pilot" => null,
                "client" => null,
                "attendant" => null
            ];

            foreach ($service_order->users as $user) {

                if ($user->trashed()) {
                    $title = "Desabilitado";
                    $style_key = "disabled";
                } else {
                    $title = $user->status ? "Ativo" : "Inativo";
                    $style_key = $user->status ? "active" : "inative";
                }

                if ($user->pivot->role_in === "pilot") {
                    $persons["pilot"] =  [
                        "id" => $user->id,
                        "status" => [
                            "value" => $user->status,
                            "title" => $title,
                            "style_key" => $style_key
                        ],
                        "name" => $user->name
                    ];
                } else if ($user->pivot->role_in === "client") {
                    $persons["client"] = [
                        "id" => $user->id,
                        "status" => [
                            "value" => $user->status,
                            "title" => $title,
                            "style_key" => $style_key
                        ],
                        "name" => $user->name
                    ];
                }
            }

            if ($service_order->attendant()->exists()) {
                $persons["attendant"] = [
                    "id" => $service_order->attendant->id,
                    "name" => $service_order->attendant->name
                ];
            }

            // Flight plans

            $flight_plans = [];
            foreach ($service_order->flight_plans as $f_index => $flight_plan) {
                $flight_plans[$f_index] = [
                    "id" => $flight_plan->id,
                    "name" => $flight_plan->name,
                    "state" => $flight_plan->state,
                    "city" => $flight_plan->city,
                    "image_url" => Storage::url($flight_plan->image_path),
                    "created_at" => date("d/m/Y", strtotime($flight_plan->created_at)),
                    "updated_at" => date("d/m/Y", strtotime($flight_plan->updated_at))
                ];
            }

            // Logs

            $logs = [];
            foreach ($service_order->logs as $s_index => $log) {
                $logs[$s_index] = [
                    "id" => $log->id,
                    "name" => $log->name,
                    "date" => date("d-m-Y", strtotime($log->timestamp)),
                    "city" => $log->city,
                    "state" => $log->state,
                    "log_url" => Storage::url($log->log_path),
                    "image_url" => Storage::url($log->image_path),
                    "created_at" => date("d-m-Y", strtotime($log->created_at))
                ];
            }

            // Incidents

            $incidents = [];
            foreach ($service_order->incidents as $i_index => $incident) {
                $incidents[$i_index] = [
                    "id" => $incident->id,
                    "type" => $incident->type,
                    "description" => $incident->description,
                    "date" => date("d-m-Y", strtotime($incident->date)),
                    "created_at" => date("d-m-Y", strtotime($incident->created_at))
                ];
            }

            // Equipments

            $equipments = [
                "drones" => [],
                "batteries" => [],
                "equipments" => []
            ];

            foreach ($service_order->drones as $dr_index => $drone) {
                $equipments["drones"][$dr_index] = [
                    "id" => $drone->id,
                    "name" => $drone->name,
                    "model" => $drone->model,
                    "weight" => $drone->weight,
                    "image_url" => Storage::url($drone->image_path),
                    "created_at" => date("d-m-Y", strtotime($drone->created_at)),
                    "updated_at" => date("d-m-Y", strtotime($drone->updated_at)),
                    "deleted_at" => date("d-m-Y", strtotime($drone->deleted_at))
                ];
            }

            foreach ($service_order->batteries as $sb_index => $battery) {
                $equipments["batteries"][$sb_index] = [
                    "id" => $battery->id,
                    "name" => $battery->name,
                    "model" => $battery->model,
                    "last_charge" => $battery->last_charge,
                    "image_url" => Storage::url($battery->image_path),
                    "created_at" => date("d-m-Y", strtotime($battery->created_at)),
                    "updated_at" => date("d-m-Y", strtotime($battery->updated_at)),
                    "deleted_at" => date("d-m-Y", strtotime($battery->deleted_at))
                ];
            }

            foreach ($service_order->equipments as $eq_index => $equipment) {
                $equipments["equipments"][$eq_index] = [
                    "id" => $equipment->id,
                    "name" => $equipment->name,
                    "model" => $equipment->model,
                    "weight" => $drone->weight,
                    "image_url" => Storage::url($equipment->image_path),
                    "created_at" => date("d-m-Y", strtotime($equipment->created_at)),
                    "updated_at" => date("d-m-Y", strtotime($equipment->updated_at)),
                    "deleted_at" => date("d-m-Y", strtotime($equipment->deleted_at))
                ];
            }

            // Reports
            $reports = [];
            foreach ($service_order->reports as $r_index => $report) {
                $reports[$r_index] = [
                    "id" => $report->id,
                    "name" => $report->name,
                    "created_at" => date("d-m-Y", strtotime($report->created_at)),
                    "updated_at" => date("d-m-Y", strtotime($report->updated_at))
                ];
            }

            // Status and allowed actions

            $allowed_actions = [
                "manage_status" => false,
                "manage_logs" => false,
                "manage_reports" => false,
                "manage_incidents" => false
            ];

            $situation = [];
            if ($service_order->situation === "created") {

                // situation data
                $situation["name"] = "Aberto";
                $situation["key"] = "created";
                $situation["description"] = "o piloto deve aprovar a solicitação";

                // actions data
                $allowed_actions["manage_status"] = getAuth()->user()->role_id === 3 && (!$service_order->pilot()->exists() || $service_order->pilot[0]->id === getAuth()->user()->id);
            } else if ($service_order->situation === "approved") {

                // situation data
                $situation["name"] = "Em atendimento";
                $situation["key"] = "approved";
                $situation["description"] = "serviço aprovado pelo piloto e em atendimento.";

                // actions data
                $can_update = $service_order->attendant->id === getAuth()->user()->id;
                $allowed_actions["manage_status"] = $can_update;
                $allowed_actions["manage_logs"] = $can_update;
                $allowed_actions["manage_reports"] = $can_update;
                $allowed_actions["manage_incidents"] = $can_update;
            } else if ($service_order->situation === "finished") {

                // situation data
                $situation["name"] = "Finalizado";
                $situation["key"] = "finished";
                $situation["description"] = "Serviço finalizado pelo piloto.";
            } else if ($service_order->situation === "canceled") {

                // situation data
                $situation["name"] = "Cancelado";
                $situation["key"] = "canceled";
                $situation["description"] = "Serviço cancelado pelo piloto.";
            }

            $this->payload["services"][$index] = [
                "id" => $service_order->id,
                "number" => $service_order->number,
                "situation" => $situation,
                "observation" => $service_order->observation,
                "users" => $persons,
                "equipments" => $equipments,
                "flight_plans" => $flight_plans,
                "logs" => $logs,
                "reports" => $reports,
                "incidents" => $incidents,
                "allowed_actions" => $allowed_actions,
                "created_at" => date("d/m/Y", strtotime($service_order->created_at)),
                "updated_at" => date("d/m/Y", strtotime($service_order->updated_at))
            ];
        }

        $created = ServiceOrder::where("tenant_id", session("tenant_id"))->filterGroup("created")->count();
        $approved = ServiceOrder::where("tenant_id", session("tenant_id"))->filterGroup("approved")->count();
        $canceled = ServiceOrder::where("tenant_id", session("tenant_id"))->filterGroup("canceled")->count();
        $finished = ServiceOrder::where("tenant_id", session("tenant_id"))->filterGroup("finished")->count();

        $this->payload["group_counter"] = [
            "created" => $created,
            "approved" => $approved,
            "finished" => $finished,
            "canceled" => $canceled,
        ];

        $this->payload["paginator"] = [
            "total_records" => $this->total(),
            "total_pages" => $this->lastPage()
        ];

        return $this->payload;
    }
}
