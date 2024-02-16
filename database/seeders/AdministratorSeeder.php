<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admin;

class AdministratorSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Admin::create([
            "name" => "Admin",
            "role_id" => 1,
            "email" => env("ADMIN_EMAIL"), 
            "password" => env("ADMIN_PASSWORD"), 
            "status" => true
        ]);

        $admin->profile()->create();
        $admin->profile->address()->create();
        $admin->profile->document()->create();
        $admin->profile->contact()->create();
    }
}
