<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modules\PersonsRoles\Roles\Role;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        Role::insert([
            [
                "name" => "Administrador",
                "profile_data" => json_encode([
                    "anac_license" => 0,
                    "cnpj" => 0,
                    "company_name" => 0,
                    "trading_name" => 0
                ])
            ],
            [
                "name" => "Gerente",
                "profile_data" => json_encode([
                    "anac_license" => 0,
                    "cnpj" => 0,
                    "company_name" => 0,
                    "trading_name" => 0
                ])
            ],
            [
                "name" => "Piloto",
                "profile_data" => json_encode([
                    "anac_license" => 1,
                    "cnpj" => 0,
                    "company_name" => 0,
                    "trading_name" => 0
                ])
            ],
            [
                "name" => "Cliente",
                "profile_data" => json_encode([
                    "anac_license" => 1,
                    "cnpj" => 1,
                    "company_name" => 1,
                    "trading_name" => 1
                ])
            ]
        ]);
    }
}
