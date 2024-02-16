<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string("profile_id")->constrained('profile');
            $table->string("anac_license")->nullable(true); 
            $table->string("cpf")->nullable(true)->unique(); 
            $table->string("cnpj")->nullable(true)->unique(); 
            $table->string("company_name")->nullable(true); 
            $table->string("trading_name")->nullable(true); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
