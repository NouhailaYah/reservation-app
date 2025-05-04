<?php

namespace App\Http\Controllers;

use App\Models\Periode;
use Illuminate\Http\Request;

class PeriodeController extends Controller
{
    public function index()
    {
        return Periode::with('ville')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom_ville' => 'required|exists:villes,nom_ville',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ]);

        return Periode::create($request->all());
    }
    public function getPeriodesParVille($nom_ville)
    {
        return Periode::where('nom_ville', $nom_ville)->get();
    }
    
}

