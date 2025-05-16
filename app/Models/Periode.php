<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Periode extends Model
{
    protected $fillable = ['nom_ville', 'date_debut', 'date_fin'];
    public function ville()
    {
        return $this->belongsTo(Ville::class, 'nom_ville', 'nom_ville');
    }

}
