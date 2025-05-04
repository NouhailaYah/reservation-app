<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreReservation extends Model
{
    protected $primaryKey = 'id_pre_reser';

    protected $fillable = ['CIN', 'nom', 'prenom', 'id_appart', 'id_resid', 'nom_ville', 'date_debut', 'date_fin', 'status'];

    public function appartement()
    {
        return $this->belongsTo(Appartement::class, 'id_appart');
    }

    public function residence()
    {
        return $this->belongsTo(Residence::class, 'id_resid');
    }

    public function reservation()
    {
        return $this->hasOne(Reservation::class, 'pre_reservation_id');
    }
}

