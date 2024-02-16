<?php

namespace App\Http\Controllers\v1\Common;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Others\UserProfile\EditPasswordRequest;
use App\Models\Admin;
use App\Models\Tenant;
use App\Models\Modules\PersonsRoles\Users\User;

class UserProfileController extends Controller
{
    function __construct()
    {
    }

    public function index()
    {
        $model = User::class;
        if (getAuth()->name === "admin") {
            $model = Admin::class;
        } else if (getAuth()->name === "tenant") {
            $model = Tenant::class;
        }

        $user = $model::where("id", getAuth()->user()->id)->first();

        $payload = [
            "name" => $user->name,
            "email" => $user->email,
            "profile_data" => $user->role->profile_data,
            "role" => $user->role->name,
            "documents" => [
                "cpf" => $user->profile->document->cpf,
                "cnpj" => $user->profile->document->cnpj,
                "company_name" => $user->profile->document->company_name,
                "trading_name" => $user->profile->document->trading_name,
                "license_anac" => $user->profile->document->anac_license
            ],
            "address" => [
                "city" => $user->profile->address->city,
                "state" => $user->profile->address->state,
                "zip_code" => $user->profile->address->zip_code,
                "neighborhood" => $user->profile->address->neighborhood,
                "street_name" => $user->profile->address->street_name,
                "number" => $user->profile->address->number
            ],
            "contact" => [
                "telephone" => $user->profile->contact->telephone,
                "ddd" => $user->profile->contact->ddd,
            ]
        ];

        return response($payload, 200);
    }

    function updateProfile(Request $request)
    {
        $model = User::class;
        if (getAuth()->name === "admin") {
            $model = Admin::class;
        } else if (getAuth()->name === "tenant") {
            $model = Tenant::class;
        }

        $user = $model::where("id", getAuth()->user()->id)->first();

        $user->update([
            "name" => $request->basic["name"],
            "email" => $request->basic["email"]
        ]);

        $user->profile->document()->update($request->documents);
        $user->profile->address()->update($request->address);
        $user->profile->contact()->update($request->contact);

        return response(["message" => "Perfil atualizado com sucesso!"], 200);
    }

    function updatePassword(EditPasswordRequest $request)
    {
        $model = User::class;
        if (getAuth()->name === "admin") {
            $model = Admin::class;
        } else if (getAuth()->name === "tenant") {
            $model = Tenant::class;
        }

        $user = $model::where("id", getAuth()->user()->id)->first();
        if (!Hash::check($request->actual_password, $user->password)) {
            throw new \Exception("A senha fornecida é inválida.");
        }
        $user->update([
            "password" => $request->password
        ]);

        return response(["message" => "Senha atualizada com sucesso!"], 200);
    }

    public function destroy(string $id)
    {
        $model = User::class;
        if (getAuth()->name === "admin") {
            $model = Admin::class;
        } else if (getAuth()->name === "tenant") {
            $model = Tenant::class;
        }

        $user = $model::where("id", getAuth()->user()->id)->first();
        $user->delete();

        return response(["message" => "Conta desabilitada com sucesso!"], 200);
    }
}
