<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Authentication\{
    SessionController,
    PasswordResetController
};

Route::post("/api/auth/admin/signin", [SessionController::class, "signInAdmin"]);
Route::post("/api/auth/manager/signin", [SessionController::class, "signInTenant"]);
Route::post("/api/auth/user/signin", [SessionController::class, "signInUser"]);
Route::post("/api/auth/reset-password/code", [PasswordResetController::class, "getCode"]);
Route::patch("/api/auth/reset-password", [PasswordResetController::class, "resetPassword"]);

Route::middleware(['auth.custom'])->group(function () {
    Route::post("/api/auth/signout", [SessionController::class, "signOut"]);
    Route::get("/api/auth/session", [SessionController::class, "getSession"]);
});
