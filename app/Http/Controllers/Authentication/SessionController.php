<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Authentication\SignInManagerRequest;
use App\Http\Requests\Authentication\SignInUserRequest;
use App\Http\Requests\Authentication\SignInAdminRequest;
use App\Events\Authentication\AccountActivationEvent;

class SessionController extends Controller
{
    function signInAdmin(SignInAdminRequest $request)
    {
        if (!Auth::guard("admin")->attempt([
            "email" => $request->login,
            "password" => $request->password
        ])) {
            throw new \Exception("E-mail ou senha são inválidos", 401);
        }

        $request->session()->regenerate();
        $payload = $this->createPayload();

        return response($payload, 200);
    }

    function signInUser(SignInUserRequest $request)
    {
        if (!Auth::guard("web")->attempt([
            "login" => $request->login,
            "password" => $request->password
        ])) {
            throw new \Exception("E-mail ou senha são inválidos", 401);
        }

        if (getAuth()->user()->trashed()) {
            throw new \Exception("Conta desabilitada", 401);
        }

        if (!getAuth()->user()->status) {
            AccountActivationEvent::dispatch();
        }

        $request->session()->regenerate();
        $request->session()->put('tenant_id', getAuth()->user()->tenant_id);

        $payload = $this->createPayload();

        return response($payload, 200);
    }

    function signInTenant(SignInManagerRequest $request)
    {
        if (!Auth::guard("tenant")->attempt([
            "email" => $request->login,
            "password" => $request->password
        ])) {
            throw new \Exception("E-mail ou senha são inválidos", 401);
        }

        if (getAuth()->user()->trashed()) {
            throw new \Exception("Conta desabilitada", 401);
        }

        if (!getAuth()->user()->status) {
            AccountActivationEvent::dispatch();
        }

        $request->session()->regenerate();
        $request->session()->put('tenant_id', getAuth()->user()->id);

        $payload = $this->createPayload();

        return response($payload, 200);
    }

    public function signOut(Request $request)
    {
        getAuth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response("", 200);
    }

    function getSession()
    {
        if (getAuth()->check()) {

            $modules = [];
            foreach (getAuth()->user()->role->modules as $module) {
                $modules[$module->symbol] = [
                    "name" => $module->name,
                    "read" => $module->pivot->read,
                    "write" => $module->pivot->write
                ];
            }

            $payload = [
                "message" => "",
                "user" => [
                    "id" => getAuth()->user()->id,
                    "name" => getAuth()->user()->first_name,
                    "role" => [
                        "id" => getAuth()->user()->role->id,
                        "name" => getAuth()->user()->role->name
                    ],
                    "modules" => $modules
                ]
            ];

            return response($payload, 200);
        }

        return response(["message" => "Unauthorized."], 401);
    }

    // Shared methods

    function createPayload()
    {

        $modules = [];
        foreach (getAuth()->user()->role->modules as $module) {
            $modules[$module->symbol] = [
                "name" => $module->name,
                "read" => $module->pivot->read,
                "write" => $module->pivot->write
            ];
        }

        $next = "";
        if (getAuth()->name === "admin") {
            $next = "/home/administration";
        } else if (getAuth()->name === "tenant") {
            $next = "/home/users";
        } else {
            $next = "/home/service-orders";
        }

        $payload = [
            "message" => "",
            "next" => $next,
            "user" => [
                "id" => getAuth()->user()->id,
                "name" => getAuth()->user()->first_name,
                "role" => [
                    "id" => getAuth()->user()->role->id,
                    "name" => getAuth()->user()->role->name
                ],
                "modules" => $modules
            ]
        ];

        return $payload;
    }
}
