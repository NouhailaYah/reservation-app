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
        Schema::create('residences', function (Blueprint $table) {
            $table->id('id_resid'); 
            $table->boolean('syndic');
            $table->boolean('salle_sport');
            $table->boolean('piscine');
            $table->boolean('spa');
            $table->boolean('parc_aquatique');
            $table->boolean('parking');
            $table->boolean('ascenseur');
            $table->boolean('service_de_blanchisserie');
            $table->string('nom_ville');
            $table->foreign('nom_ville')->references('nom_ville')->on('villes');
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down():void 
    {
        Schema::dropIfExists('residences');
    }
};
