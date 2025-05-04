<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $fillable = [
        'CIN',
        'nom',
        'prenom',
        'matricule',
        'fonction',
        'grade',
        'service',
        'login',
        'password',
    ];
    
    protected $hidden = [
        'password',
    ];
}
