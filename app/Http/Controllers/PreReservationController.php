<?php

namespace App\Http\Controllers;

use App\Models\PreReservation;
use Illuminate\Http\Request;

class PreReservationController extends Controller
{
    public function index()
    {
        return PreReservation::with(['appartement', 'residence'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'CIN' => 'required|string',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'id_appart' => 'required|exists:appartements,id_appart',
            'id_resid' => 'required|exists:residences,id_resid',
            'nom_ville' => 'required|exists:villes,nom_ville',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'status' => 'in:en_attente,confirmé,expiré',
        ]);
        
        $debutAnnee = now()->startOfYear();
        $finAnnee = now()->endOfYear();
        
        $nb = PreReservation::where('CIN', $request->CIN)->whereBetween('created_at', [$debutAnnee, $finAnnee])->count();
        if ($nb >= 1) {
            return response()->json(['message' => 'Une seule réservation par an est autorisée'], 403);
        }
        
        return PreReservation::create($request->all());
    }
}

