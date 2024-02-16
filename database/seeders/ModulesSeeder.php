<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Modules\Module;

class ModulesSeeder extends Seeder
{
    public function run(): void
    {
        Module::insert([
            ["name" => "Administração", "description" => "Gerenciamento para administradores", "symbol" => "gadmin"],
            ["name" => "Pessoas e Cargos", "description" => "Gerenciamento de Pessoas e Cargos", "symbol" => "gpc"],
            ["name" => "Planos de Voo", "description" => "Gerenciamento de Planos de Voo", "symbol" => "gpv"],
            ["name" => "Ordens de Serviço", "description" => "Gerenciamento de Ordens de Serviço", "symbol" => "gos"],
            ["name" => "Equipamentos", "description" => "Gerenciamento de Drones, Baterias e Equipamentos", "symbol" => "ge"]
        ]);
    }
}
