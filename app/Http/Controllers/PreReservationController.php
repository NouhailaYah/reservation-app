<?php

namespace App\Http\Controllers;

use App\Models\PreReservation;
use Illuminate\Http\Request;
use App\Models\Agent;
use App\Notifications\PreReservationPendingNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;


class PreReservationController extends Controller
{
    public function index()
    {
        return PreReservation::with(['appartement', 'residence'])->get();
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'cin' => 'required|string|max:20',
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'id_appart' => 'required|integer|exists:appartements,id',
            'id_resid' => 'required|integer|exists:residences,id',
            'nom_ville' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after_or_equal:date_debut',
            'status' => 'required|string|in:En attente,Confirmée,Refusée',
        ]);
        // Vérifier si l'agent a déjà une réservation cette année
        $debutAnnee = now()->startOfYear();
        $finAnnee = now()->endOfYear();
        
        $nb = PreReservation::where('CIN', $request->CIN)->whereBetween('created_at', [$debutAnnee, $finAnnee])->count();
        if ($nb >= 1) {
            return response()->json(['message' => 'Une seule réservation par an est autorisée'], 403);
        }
        
         // Enregistrer la pré-réservation
        $preReservation = PreReservation::create([
            'cin' => $validatedData['cin'],
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom'],
            'id_appart' => $validatedData['id_appart'],
            'id_resid' => $validatedData['id_resid'],
            'nom_ville' => $validatedData['nom_ville'],
            'date_debut' => $validatedData['date_debut'],
            'date_fin' => $validatedData['date_fin'],
            'status' => 'En attente',
        ]);
        
        // Envoyer un email de confirmation de pré-réservation
        $agent = Auth::user();
        if ($agent) {
            $reservationDetails = [
                'nom' => $preReservation->nom,
                'prenom' => $preReservation->prenom,
                'nom_ville' => $preReservation->nom_ville,
                'id_resid' => $preReservation->id_resid,
                'date_debut' => $preReservation->date_debut,
                'date_fin' => $preReservation->date_fin,
            ];
            Notification::route('mail', $agent->email)->notify(new PreReservationPendingNotification($reservationDetails));
        }
        
        return response()->json([
            'message' => 'Pré-réservation envoyée. En attente de validation. Vous recevrez un email de confirmation.',
            'pre_reservation' => $preReservation,
        ],201);
        
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

