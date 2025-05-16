<?php

namespace App\Http\Controllers;

use App\Models\Periode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PeriodeController extends Controller
{
    public function index()
    {
        $periodes = Periode::all();
        return response()->json($periodes);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom_ville' => 'required|string|exists:villes,nom_ville',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $periode = Periode::create([
            'nom_ville' => $request->nom_ville,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
        ]);

        return response()->json(['message' => 'Période ajoutée avec succès', 'periode' => $periode]);
    }
    public function getByNomVille($nom_ville)
    {
        $periodes = Periode::where('nom_ville', $nom_ville)->get(['date_debut', 'date_fin']);
        return response()->json($periodes);
    }

}
