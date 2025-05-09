<?php

namespace App\Http\Controllers;

use App\Models\Ville;
use Illuminate\Http\Request;
use App\Models\Periode;
use App\Models\Appartement;

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

    public function periodeEtAppartements($nom_ville)
    {
        $ville = Ville::where('nom_ville', $nom_ville)->first();
    
        if (!$ville) {
            return response()->json(['message' => 'Ville non trouvée'], 404);
        }
    
        $periode = Periode::where('nom_ville', $nom_ville)->first();
    
        if (!$periode) {
            return response()->json(['message' => 'Aucune période définie pour cette ville'], 404);
        }
    
        $appartements = Appartement::where('nom_ville', $nom_ville)->get(['id', 'nom', 'capacite_max']);
    
        return response()->json([
            'periode' => [
                'date_debut' => $periode->date_debut,
                'date_fin' => $periode->date_fin
            ],
            'appartements' => $appartements
        ]);
        

    }
    public function getPeriodeEtAppartements($ville)
    {
        $periodes = Periode::where('nom_ville', $ville)->get();
        $appartements = Appartement::where('nom_ville', $ville)->get();
    
        return response()->json([
            'periodes' => $periodes,
            'appartements' => $appartements,
        ]);
    }
}
