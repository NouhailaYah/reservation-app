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
        Schema::create('agents', function (Blueprint $table) {
            $table->id('id_agent'); // identifiant personnalisé
            $table->string('CIN')->unique();
            $table->string('nom');
            $table->string('prenom');
            $table->string('matricule')->unique();
            $table->string('fonction');
            $table->string('grade');
            $table->string('service');
            $table->string('login')->unique(); // login distinct de l'email
            $table->string('password');
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('agents');
    }
};
