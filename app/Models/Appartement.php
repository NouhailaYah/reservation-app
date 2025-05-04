<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appartement extends Model
{
    protected $primaryKey = 'id_appart';

    protected $fillable = [
        'superficie', 'etages', 'nbr_chambre', 'nbr_salles_bain',
        'nbr_salles', 'balcon', 'climatisation', 'wifi', 'prix',
        'nom_ville', 'id_resid'
    ];

    public function ville()
    {
        return $this->belongsTo(Ville::class, 'nom_ville', 'nom_ville');
    }

    public function residence()
    {
        return $this->belongsTo(Residence::class, 'id_resid');
    }

    public function images()
    {
        return $this->hasMany(Image::class, 'id_appart');
    }

    public function preReservations()
    {
        return $this->hasMany(PreReservation::class, 'id_appart');
    }
}

