<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Residence extends Model
{
    protected $primaryKey = 'id_resid';

    protected $fillable = [
        'syndic', 'salle_sport', 'piscine', 'spa', 'parc_aquatique',
        'parking', 'ascenseur', 'service_de_blanchisserie', 'nom_ville'
    ];

    public function ville()
    {
        return $this->belongsTo(Ville::class, 'nom_ville', 'nom_ville');
    }

    public function appartements()
    {
        return $this->hasMany(Appartement::class, 'id_resid');
    }
}
