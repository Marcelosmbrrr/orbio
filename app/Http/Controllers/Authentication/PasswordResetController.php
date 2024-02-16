<?php

namespace App\Http\Controllers\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\Tenant;
use App\Models\Modules\PersonsRoles\Users\User;
use App\Notifications\Authentication\PasswordResetCodeNotification;
use App\Http\Requests\Authentication\PasswordResetCodeRequest;
use App\Http\Requests\Authentication\PasswordResetRequest;
use App\Models\Modules\PersonsRoles\Users\PasswordReset;

class PasswordResetController extends Controller
{
    public function __construct(PasswordReset $passwordResetModel)
    {
        $this->model = $passwordResetModel;
    }

    function getCode(PasswordResetCodeRequest $request)
    {
        // users, tenants or admins
        $table = request()->entity;

        $code = Str::random(10);

        if($table == "users") {
            $user = User::where('email', $request->email)->first();
        } else if($table == "tenants") {
            $user = Tenant::where('email', $request->email)->first();
        } else if($table == "admins") {
            $user = Admin::where('email', $request->email)->first();
        }

        // Invalidate previously not disabled tokens
        if ($user->password_reset_token()->exists()) {
            $user->password_reset_token()->delete();
        }

        $user->password_reset_token()->create([
            "token" => $code
        ]);

        $user->notify(new PasswordResetCodeNotification());

        return response(["message" => "Sucesso! Confira o seu e-mail."], 200);
    }

    function resetPassword(PasswordResetRequest $request)
    {
        // users, tenants or admins
        $table = request()->entity;

        if($table == "users") {
            $user = User::whereHas("password_reset_token", function ($query) use ($request) {
                $query->where("token", $request->code);
            })->first();
        } else if($table == "tenants") {
            $user = Tenant::whereHas("password_reset_token", function ($query) use ($request) {
                $query->where("token", $request->code);
            })->first();
        } else if($table == "admins") {
            $user = Admin::whereHas("password_reset_token", function ($query) use ($request) {
                $query->where("token", $request->code);
            })->first();
        }

        if (!$user) {
            return response(["message" => "Código inválido"], 404);
        }

        $user->update([
            "password" => Hash::make($request->password)
        ]);

        $user->password_reset_token()->delete();

        return response(["message" => "Senha alterada com sucesso!"], 200);
    }
}
