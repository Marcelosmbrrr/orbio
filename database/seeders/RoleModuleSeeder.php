<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleModuleSeeder extends Seeder
{
    public function run(): void
    {
        $admin_access = [
            ["module_id" => 1, "role_id" => 1, "read" => true, "write" => true], // administration
            ["module_id" => 2, "role_id" => 1, "read" => false, "write" => false], // persons and roles
            ["module_id" => 3, "role_id" => 1, "read" => false, "write" => false], // flights
            ["module_id" => 4, "role_id" => 1, "read" => false, "write" => false], // orders
            ["module_id" => 5, "role_id" => 1, "read" => false, "write" => false], // equipments
        ];

        DB::table("role_module")->insert($admin_access);

        $tenant_access = [
            ["module_id" => 1, "role_id" => 2, "read" => false, "write" => false], // administration
            ["module_id" => 2, "role_id" => 2, "read" => true, "write" => true], // persons and roles
            ["module_id" => 3, "role_id" => 2, "read" => true, "write" => true], // flights
            ["module_id" => 4, "role_id" => 2, "read" => true, "write" => true], // orders
            ["module_id" => 5, "role_id" => 2, "read" => true, "write" => true], // equipments
        ];

        DB::table("role_module")->insert($tenant_access);

        $pilot_access = [
            ["module_id" => 1, "role_id" => 3, "read" => false, "write" => false], // administration
            ["module_id" => 2, "role_id" => 3, "read" => false, "write" => false], // persons and roles
            ["module_id" => 3, "role_id" => 3, "read" => true, "write" => true], // flights
            ["module_id" => 4, "role_id" => 3, "read" => true, "write" => true], // orders
            ["module_id" => 5, "role_id" => 3, "read" => true, "write" => true], // equipments
        ];

        DB::table("role_module")->insert($pilot_access);

        $client_access = [
            ["module_id" => 1, "role_id" => 4, "read" => false, "write" => false], // administration
            ["module_id" => 2, "role_id" => 4, "read" => false, "write" => false], // persons and roles
            ["module_id" => 3, "role_id" => 4, "read" => false, "write" => false], // flights
            ["module_id" => 4, "role_id" => 4, "read" => true, "write" => false], // orders
            ["module_id" => 5, "role_id" => 4, "read" => false, "write" => false], // equipments
        ];

        DB::table("role_module")->insert($client_access);
    }
}
