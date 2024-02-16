<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('address', function (Blueprint $table) {
            $table->id();
            $table->string("profile_id")->constrained('profile');
            $table->string("state")->nullable(true);
            $table->string("city")->nullable(true);
            $table->string("neighborhood")->nullable(true);
            $table->string("street_name")->nullable(true);
            $table->string("number")->nullable(true);
            $table->string("zip_code")->nullable(true);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('address');
    }
};
