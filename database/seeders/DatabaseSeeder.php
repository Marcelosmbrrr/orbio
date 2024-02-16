<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(ModulesSeeder::class);
        $this->call(RolesSeeder::class);
        $this->call(RoleModuleSeeder::class);
        $this->call(AdministratorSeeder::class);
    }
}
