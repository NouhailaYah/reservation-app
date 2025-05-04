<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['appartement_id', 'url'];

    public function appartement()
    {
        return $this->belongsTo(Appartement::class, 'id_appart');
    }
}
