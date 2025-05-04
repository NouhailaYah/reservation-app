<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
    protected $fillable = ['nom_ville'];

    public function periodes()
    {
        return $this->hasMany(Periode::class, 'nom_ville');
    }

    public function residences()
    {
        return $this->hasMany(Residence::class, 'nom_ville');
    }

    public function appartements()
    {
        return $this->hasMany(Appartement::class, 'nom_ville');
    }
}

