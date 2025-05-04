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
        Schema::create('appartements', function (Blueprint $table) {
            $table->bigIncrements('id_appart');
            $table->double('superficie');
            $table->integer('etages');
            $table->integer('nbr_chambre');
            $table->integer('nbr_salles_bain');
            $table->integer('nbr_salles');
            $table->boolean('balcon');
            $table->boolean('climatisation');
            $table->boolean('wifi');
            $table->double('prix');
            $table->string('nom_ville');  
            $table->foreign('nom_ville')->references('nom_ville')->on('villes');
            $table->unsignedBigInteger('id_resid');
            $table->foreign('id_resid')->references('id_resid')->on('residences')->onDelete('cascade');
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
        Schema::dropIfExists('appartements');
    }
};
