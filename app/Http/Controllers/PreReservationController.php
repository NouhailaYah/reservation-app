<?php

namespace App\Http\Controllers;

use App\Mail\Confirmationpre;
use App\Models\PreReservation;
use Illuminate\Http\Request;
use App\Models\Agent;
use App\Notifications\PreReservationPendingNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Appartement;
use Illuminate\Support\Facades\Mail;



class PreReservationController extends Controller
{
    public function index()
    {
        return PreReservation::with(['appartement', 'residence'])->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'CIN' => 'required|string|max:20',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'id_appart' => 'required|integer|exists:appartements,id',
            'id_resid' => 'required|integer|exists:residences,id',
            'nom_ville' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            
        ]);
        // Vérifier si l'agent a déjà une réservation cette année
        $debutAnnee = now()->startOfYear();
        $finAnnee = now()->endOfYear();
        $nb = PreReservation::where('CIN', $request->CIN)->whereBetween('created_at', [$debutAnnee, $finAnnee])->count();
        if ($nb >= 1) {
            return response()->json(['message' => 'Une seule réservation par an est autorisée'], 403);
        }

        // Calculer le prix total de la réservation
        $appartement = Appartement::findOrFail($validatedData['id_appart']);
        $prixParJour = $appartement->prix;
        
        $dateDebut = Carbon::parse($validatedData['date_debut']);
        $dateFin = Carbon::parse($validatedData['date_fin']);
        $nombreJours = $dateDebut->diffInDays($dateFin);
        if ($nombreJours < 1) {
            $nombreJours = 1; // Minimum 1 jour
        }
        $prixTotal = $nombreJours * $prixParJour;

         // Enregistrer la pré-réservation
       // Enregistrer la pré-réservation
$confirmationpre = Confirmationpre::create([
    'CIN' => $validatedData['CIN'],
    'nom' => $validatedData['nom'],
    'prenom' => $validatedData['prenom'],
    'id_appart' => $validatedData['id_appart'],
    'id_resid' => $validatedData['id_resid'],
    'nom_ville' => $validatedData['nom_ville'],
    'prix' => $prixTotal,
    'date_debut' => $validatedData['date_debut'],
    'date_fin' => $validatedData['date_fin'],
    'status' => 'En attente',
]);

// Envoi de l'email après création
Mail::to('nouhailayahyaoui05@gmail.com')->send(new \App\Mail\Confirmationpre($confirmationpre));

return response()->json([
    'message' => 'Pré-réservation envoyée. En attente de validation. Vous recevrez un email de confirmation.',
    'pre_reservation' => $confirmationpre,
    'prix_total' => $prixTotal
], 201);

        
    }

    public function valider($id)
    {
        $preReservation = PreReservation::findOrFail($id);
        $preReservation->status = 'validée';
        $preReservation->save();
    
        return response()->json(['message' => 'Pré-réservation validée']);
    }
    
    public function refuser($id)
    {
        $preReservation = PreReservation::findOrFail($id);
        $preReservation->status = 'refusée';
        $preReservation->save();
    
        return response()->json(['message' => 'Pré-réservation refusée']);
    }
    
}

