<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Agent extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'agents';
    protected $primaryKey = 'id_agent';  
    public $incrementing = true;          
    protected $keyType = 'int'; 

    protected $fillable = [
        'id_agent',
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
        'remember_token',
    ];

/*protected $casts = [
        'email_verified_at' => 'datetime',
    ];*/
}
