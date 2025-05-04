<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;


class Reservation extends Model
{
    protected $fillable = ['pre_reservation_id', 'recu_paiement', 'validation_admin'];

    public function preReservation()
    {
        return $this->belongsTo(PreReservation::class);
    }

    public function validerReservation(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $request->validate([
            'validation_admin' => 'in:valide,refuse',
        ]);
    
        $reservation->validation_admin = $request->validation_admin;
        $reservation->save();
    
        return response()->json(['message' => 'Statut mis à jour avec succès']);
    }
    
}
