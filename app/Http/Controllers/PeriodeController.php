<?php

namespace App\Http\Controllers;

use App\Models\Periode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Ville;
use App\Models\Appartement;

class PeriodeController extends Controller
{
    public function index()
    {
        $periodes = Periode::all();
        return response()->json($periodes, 200);
    }

    public function store(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'nom_ville' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
        ]);

        // Si la validation échoue
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Création de la période
        $periode = Periode::create([
            'nom_ville' => $request->nom_ville,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
        ]);

        return response()->json([
            'message' => 'Période ajoutée avec succès.',
            'periode' => $periode
        ], 201);
    }

    public function getByVille($nom_ville)
    {
    // Chercher la ville
        $periodes = Periode::where('nom_ville', $nom_ville)->get();

        if ($periodes->isEmpty()) {
            return response()->json(['message' => 'Aucune période pour cette ville'], 404);
        }

        return response()->json($periodes);
    }
    /*public function getPeriodesByAppartement($id_appart)
    {
        $appartement = Appartement::find($id_appart);
        if (!$appartement) {
            return response()->json(['message' => 'Appartement non trouvé'], 404);
        }
        $periodes = $appartement->periodes()->get();

        return response()->json($periodes);
    }
    */
}
