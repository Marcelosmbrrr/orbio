<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId("service_order_id")->constrained('service_orders')->onDelete('cascade');
            $table->string('name');
            $table->string('filename')->unique();
            $table->string("coordinates")->nullable(true);
            $table->string("city")->nullable(true);
            $table->string("state")->nullable(true);
            $table->string('log_path');
            $table->string("image_path")->nullable(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('logs');
    }
};
