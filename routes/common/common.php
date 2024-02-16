<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\v1\Common\Tenant\TenantUsersController;
use App\Http\Controllers\v1\Common\Tenant\TenantRolesController;
use App\Http\Controllers\v1\Common\RevertDeletionController;
use App\Http\Controllers\v1\Common\UserProfileController;

Route::middleware(['auth.custom'])->group(function () {
    // User profile
    Route::get("api/v1/modules/profile", [UserProfileController::class, "index"]);
    Route::patch("api/v1/modules/profile/update", [UserProfileController::class, "updateProfile"]);
    Route::patch("api/v1/modules/profile/password/update", [UserProfileController::class, "updatePassword"]);
    // Deletion
    Route::patch("api/v1/actions/revert-deletion/{table}", RevertDeletionController::class);
    // Tenant generic fetchers
    Route::get("api/v1/actions/users", TenantUsersController::class);
    Route::get("api/v1/actions/roles", TenantRolesController::class);
});
