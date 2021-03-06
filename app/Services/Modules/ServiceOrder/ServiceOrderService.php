<?php

namespace App\Services\Modules\ServiceOrder;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
// Custom
use App\Models\User\UserModel;
use App\Models\Orders\ServiceOrderModel;
use App\Services\FormatDataService;
use App\Models\Pivot\ServiceOrderHasUserModel;
use App\Models\Pivot\ServiceOrderHasFlightPlanModel;
use App\Events\Modules\Orders\OrderCreatedEvent;
use App\Events\Modules\Orders\OrderUpdatedEvent;
use App\Events\Modules\Orders\OrderDeletedEvent;


class ServiceOrderService{

    private FormatDataService $format_data_service;

    /**
     * Dependency injection.
     * 
     * @param App\Services\FormatDataService $service
     */
    public function __construct(FormatDataService $service){
        $this->format_data_service = $service;
    }

    /**
    * Load all service orders with pagination.
    *
    * @param int $limit
    * @param int $actual_page
    * @param int|string $where_value
    * @return \Illuminate\Http\Response
    */
    public function loadServiceOrdersWithPagination(int $limit, int $current_page, int|string $where_value){

        $data = DB::table('service_orders')
        ->where("service_orders.deleted_at", null)
        ->when($where_value, function ($query, $where_value) {

            $query->where('service_orders.id', $where_value);

        })->orderBy('service_orders.id')->paginate($limit, $columns = ['*'], $pageName = 'page', $current_page);

        if($data->total() > 0){

            $data_formated = $this->format_data_service->serviceOrderPanelDataFormatting($data);

            return response($data_formated, 200);

        }else{

            return response(["message" => "Nenhuma ordem de serviço encontrada."], 404);

        }

    }

    /**
     * Create service order.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createServiceOrder(Request $request){

        DB::transaction(function () use ($request) {
            
            $pilot = UserModel::findOrFail($request->pilot_id);
            $client = UserModel::findOrFail($request->client_id);

            $new_service_order = ServiceOrderModel::create(
                [
                    "start_date" => $request->start_date,
                    "end_date" => $request->end_date,
                    "numOS" => "os.".time(),
                    "creator_name" => Auth::user()->name,
                    "pilot_name" => $pilot->name,
                    "client_name" => $client->name,
                    "observation" => $request->observation,
                    "status" => $request->boolean("status")
                ]
            );

            ServiceOrderHasUserModel::insert([
                ["service_order_id" => $new_service_order->id,"user_id" => Auth::user()->id], 
                ["service_order_id" => $new_service_order->id,"user_id" => $request->pilot_id],
                ["service_order_id" => $new_service_order->id,"user_id" => $request->client_id]
            ]);

            foreach($request->flight_plans_ids as $index => $value){

                ServiceOrderHasFlightPlanModel::insert([
                    "service_order_id" => $new_service_order->id,
                    "flight_plan_id" => $value
                ]);

            }

            event(new OrderCreatedEvent([
                "initial_date" => $request->start_date,
                "final_date" =>  $request->end_date,
                "creator" => [
                    "name" => Auth::user()->name,
                    "email" => Auth::user()->email
                ],
                "pilot" => [
                    "name" => $pilot->name,
                    "email" => $pilot->email
                ],
                "client" => [
                    "name" => $client->name,
                    "email" => $client->email
                ],
                "observation" => $request->observation
            ]));

        });

        return response(["message" => "Ordem de serviço criada com sucesso!"], 200);

    }

    /**
    * Update service order.
    *
    * @param \Illuminate\Http\Request $request
    * @param int $service_order_id
    * @return \Illuminate\Http\Response
    */
    public function updateServiceOrder(Request $request, int $service_order_id){

        DB::transaction(function () use ($request, $service_order_id) {
            
            $pilot_data = UserModel::find($request->pilot_id);
            $client_data = UserModel::find($request->client_id);

            // Update da ordem de serviço
            $order = ServiceOrderModel::where('id', $service_order_id)->update(
                [
                    "start_date" => $request->start_date,
                    "end_date" => $request->end_date,
                    "creator_name" => Auth::user()->name,
                    "pilot_name" => $pilot_data->name,
                    "client_name" => $client_data->name,
                    "observation" => $request->observation,
                    "status" => $request->boolean("status")
                ]
            );

            // Deleta as relações atuais com os usuários - é mais fácil desse modo
            ServiceOrderHasUserModel::where("service_order_id", $service_order_id)->delete();
            // Cria novamente as relações com cada usuário envolvido na ordem de serviço (criador, piloto e cliente)
            ServiceOrderHasUserModel::insert([
                ["service_order_id" => (int) $service_order_id,"user_id" => Auth::user()->id], 
                ["service_order_id" => (int) $service_order_id,"user_id" => $request->pilot_id],
                ["service_order_id" => (int) $service_order_id,"user_id" => $request->client_id]
            ]);

            // Deleta as relações atuais com os planos de vôo - é mais fácil desse modo
            ServiceOrderHasFlightPlanModel::where("service_order_id", $service_order_id)->delete();
            // Cria novamente as relações com cada plano de vôo envolvido na ordem de serviço
            foreach($request->flight_plans_ids as $index => $flight_plan_id){
                ServiceOrderHasFlightPlanModel::insert([
                    "service_order_id" => (int) $service_order_id,
                    "flight_plan_id" => (int) $flight_plan_id
                ]);
            }

        });

        return response(["message" => "Ordem de serviço atualizada com sucesso!"], 200);

    }

    /**
     * Soft delete service order.
     *
     * @param int $service_order_id
     * @return \Illuminate\Http\Response
     */
    public function deleteServiceOrder(int $service_order_id){

        DB::transaction(function () use ($service_order_id) {
            
            $service_order = ServiceOrderModel::find($service_order_id);

            // Desvinculation with flight_plans through service_order_has_flight_plan table
            if(!empty($service_order->service_order_has_flight_plan)){ 
                $service_order->service_order_has_flight_plan()->delete();
            }

            // Desvinculation with user through service_order_has_user table
            $service_order->service_order_has_user()->delete();

            $service_order->delete();

            //event(new OrderDeletedEvent($service_order));

        });

        return response(["message" => "Ordem de serviço deletada com sucesso!"], 200);

    }
    
}