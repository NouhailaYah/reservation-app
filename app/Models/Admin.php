<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    protected $fillable = ['nom', 'prenom', 'email', 'password'];

    protected $hidden = ['password'];
}

