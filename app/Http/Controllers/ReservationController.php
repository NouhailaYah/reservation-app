<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        return Reservation::with('preReservation')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'pre_reservation_id' => 'required|exists:pre_reservations,id_pre_reser',
            'recu_paiement' => 'nullable|string',
            'validation_admin' => 'in:valide,refuse,en_attente',
        ]);

        return Reservation::create($request->all());
    }

    public function uploadRecu(Request $request, $id)
    {
        $request->validate([
            'recu_paiement' => 'required|file|mimes:pdf,jpg,png,jpeg|max:2048',
        ]);
    
        $reservation = Reservation::findOrFail($id);
    
        $path = $request->file('recu_paiement')->store('recus', 'public');
        $reservation->recu_paiement = $path;
        $reservation->save();
    
        return response()->json(['message' => 'Reçu téléchargé avec succès', 'path' => $path]);
    }

    public function validerPaiement($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->validation_admin = 'valide';
        $reservation->save();
    
        return response()->json(['message' => 'Paiement validé par l\'admin']);
    }
    
    public function refuserPaiement($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->validation_admin = 'refuse';
        $reservation->save();
    
        return response()->json(['message' => 'Paiement refusé par l\'admin']);
    }
    
    
}
