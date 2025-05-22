<?php

namespace App\Http\Controllers;

use App\Models\Appartement;
use Illuminate\Http\Request;
use App\Models\Image;


class AppartementController extends Controller
{
    public function index(Request $request)
    {
        $query = Appartement::with(['images', 'residence.ville']);
        // Filtre par ville
        if ($request->has('ville')) {
            $query->whereHas('residence', function ($q) use ($request) {
                $q->whereHas('ville', function ($q2) use ($request) {
                    $q2->where('nom_ville', $request->ville);
                });
        });
        }
        // Filtre par période 
        if ($request->has(['date_debut', 'date_fin'])) {
            $dateDebut = $request->date_debut;
            $dateFin = $request->date_fin;

            $query->whereDoesntHave('prereservations', function ($q) use ($dateDebut, $dateFin) {
                $q->where(function ($q2) use ($dateDebut, $dateFin) {
                    $q2->whereBetween('date_debut', [$dateDebut, $dateFin])
                        ->orWhereBetween('date_fin', [$dateDebut, $dateFin])
                        ->orWhere(function ($q3) use ($dateDebut, $dateFin) {
                        $q3->where('date_debut', '<=', $dateDebut)
                        ->where('date_fin', '>=', $dateFin);
                        });
                });

            });
        }
        $appartements = $query->get();
        return response()->json($appartements);
    }


    public function store(Request $request)
    {
        $request->validate([
            'superficie' => 'required|numeric',
            'etages' => 'required|integer',
            'nbr_chambre' => 'required|integer',
            'nbr_salles_bain' => 'required|integer',
            'nbr_salles' => 'required|integer',
            'balcon' => 'boolean',
            'climatisation' => 'boolean',
            'wifi' => 'boolean',
            'prix' => 'required|numeric',
            'nom_ville' => 'required|exists:villes,nom_ville',
            'id_resid' => 'required|exists:residences,id_resid',
        ]);

        return Appartement::create($request->all());
    }

    public function storeWithImage(Request $request)
    {
        $request->validate([
            'superficie' => 'required|numeric',
            'etages' => 'required|integer',
            'nbr_chambre' => 'required|integer',
            'nbr_salles_bain' => 'required|integer',
            'nbr_salles' => 'required|integer',
            'balcon' => 'required|boolean',
            'climatisation' => 'required|boolean',
            'wifi' => 'required|boolean',
            'prix' => 'required|numeric',
            'nom_ville' => 'required|exists:villes,nom_ville',
            'id_resid' => 'required|exists:residences,id_resid',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);
    
        // 1. Créer l'appartement
        $appartement = Appartement::create($request->only([
            'superficie', 'etages', 'nbr_chambre', 'nbr_salles_bain', 'nbr_salles',
            'balcon', 'climatisation', 'wifi', 'prix', 'nom_ville', 'id_resid'
        ]));
    
        // 2. Sauvegarder l’image
        $path = $request->file('image')->store('appartements', 'public');
    
        // 3. Lier l’image à l’appartement
        $image = new Image();
        $image->nom_image = $path;
        $image->id_appart = $appartement->id_appart;
        $image->save();
    
        return response()->json([
            'message' => 'Appartement et image ajoutés',
            'appartement' => $appartement,
            'image' => $image,
        ]);
    }
    public function show($id)
    {
        $appartement = Appartement::with('residence')->find($id);
    
        if (!$appartement) {
            return response()->json(['message' => 'Appartement introuvable'], 404);
        }
    
        return response()->json($appartement);
    }
}
