<?php

namespace App\Http\Controllers;

use App\Models\Ville;
use Illuminate\Http\Request;

class VilleController extends Controller
{
    public function index()
    {
        return Ville::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom_ville' => 'required|unique:villes',
        ]);

        return Ville::create($request->only('nom_ville'));
    }
}
