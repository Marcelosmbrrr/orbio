<?php

use Illuminate\Support\Facades\Auth;

function getAuth()
{
    $guard = "web";
    if (Auth::guard("tenant")->check()) {
        $guard = "tenant";
    } else if (Auth::guard("admin")->check()) {
        $guard = "admin";
    }

    return Auth::guard($guard);
}

function getTenantUUID()
{
    $uuid = "";
    if (Auth::guard("web")->check()) {
        $uuid = getAuth()->user()->tenant->uuid;
    } else if (Auth::guard("tenant")->check()) {
        $uuid = getAuth()->user()->uuid;
    }

    return $uuid;
}
