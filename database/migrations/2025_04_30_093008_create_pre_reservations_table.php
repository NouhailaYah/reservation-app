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
        Schema::create('pre_reservations', function (Blueprint $table) {
            $table->id('id_pre_reser'); 
            $table->string('CIN');
            $table->string('nom');
            $table->string('prenom');
            $table->foreignId('id_appart')->constrained('appartements', 'id_appart')->onDelete('cascade');
            $table->foreignId('id_resid')->constrained('residences', 'id_resid')->onDelete('cascade');
            $table->string('nom_ville');
            $table->decimal('prix');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->string('status')->default('en_attente');
    
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
        Schema::dropIfExists('pre_reservations');
    }
};
