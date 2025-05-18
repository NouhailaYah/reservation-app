<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VilleController;
use App\Http\Controllers\ResidenceController;
use App\Http\Controllers\AppartementController;
use App\Http\Controllers\PeriodeController;
use App\Http\Controllers\PreReservationController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\AgentAuthController;

// Routes Admin
Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::post('register', [AdminAuthController::class, 'register']);
    Route::middleware('auth:sanctum')->post('logout', [AdminAuthController::class, 'logout']);

    // Routes protégées par admin
    Route::middleware('auth:sanctum')->group(function () {
        Route::put('pre-reservations/{id}/valider', [PreReservationController::class, 'valider']);
        Route::put('pre-reservations/{id}/refuser', [PreReservationController::class, 'refuser']);
        Route::put('reservations/{id}/valider-paiement', [ReservationController::class, 'validerPaiement']);
        Route::put('reservations/{id}/refuser-paiement', [ReservationController::class, 'refuserPaiement']);
    });
});

// Routes Agent
Route::prefix('agent')->group(function () {
    Route::post('register', [AgentAuthController::class, 'register']);
    Route::post('login', [AgentAuthController::class, 'login']);
    
    // Routes protégées pour les agents (token nécessaire)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AgentAuthController::class, 'logout']);
    });
});

// Routes de gestion des ressources
Route::apiResource('villes', VilleController::class);
Route::apiResource('residences', ResidenceController::class);
Route::apiResource('appartements', AppartementController::class);
Route::apiResource('periodes', PeriodeController::class);
Route::apiResource('pre-reservations', PreReservationController::class);
Route::apiResource('reservations', ReservationController::class);

// Gestion des images
Route::post('images', [ImageController::class, 'store']);
Route::post('/appartements/with-image', [AppartementController::class, 'storeWithImage']);

// Gestion des périodes par l'admin
Route::get('/periodes/ville/{nom_ville}', [PeriodeController::class, 'getPeriodesParVille']);

// Pré-réservations
Route::post('/pre-reservation/details', [PreReservationController::class, 'getDetails']);
Route::post('/pre-reservation', [PreReservationController::class, 'store']);

// Récupération des périodes et appartements par ville
Route::get('/villes/{nom_ville}/periode-et-appartements', [PeriodeController::class, 'getByNomVille']);

Route::get('/pre-reservation/details', [PreReservationController::class, 'details']);
Route::get('/periodes/ville/{nom_ville}', [PeriodeController::class, 'getByNomVille']);

