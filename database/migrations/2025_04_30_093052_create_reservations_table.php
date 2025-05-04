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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_pre_reser');
            $table->foreign('id_pre_reser')->references('id_pre_reser')->on('pre_reservations')->onDelete('cascade');
            $table->string('recu_paiement')->nullable(); // chemin du fichier uploadé
            $table->enum('validation_admin', ['valide', 'refuse', 'en_attente'])->default('en_attente');
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
        Schema::dropIfExists('reservations');
    }
};
