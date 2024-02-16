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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('login');
            $table->foreignId('tenant_id')->constrained('tenants');
            $table->foreignId('role_id')->constrained('roles');
            $table->string("name");
            $table->string("email");
            $table->string("password");
            $table->boolean("status")->default(false);
            $table->unique(['tenant_id', 'email']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
