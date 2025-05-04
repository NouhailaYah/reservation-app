<?php

namespace App\Http\Controllers;

use App\Models\Residence;
use Illuminate\Http\Request;

class ResidenceController extends Controller
{
    public function index()
    {
        return Residence::with('ville')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom_ville' => 'required|exists:villes,nom_ville',
            'syndic' => 'boolean',
            'salle_sport' => 'boolean',
            'piscine' => 'boolean',
            'spa' => 'boolean',
            'parc_aquatique' => 'boolean',
            'parking' => 'boolean',
            'ascenseur' => 'boolean',
            'service_de_blanchisserie' => 'boolean',
        ]);

        return Residence::create($request->all());
    }
}
