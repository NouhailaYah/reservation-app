<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\AgentAuthController;

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::middleware('auth:sanctum')->post('logout', [AdminAuthController::class, 'logout']);
});

Route::prefix('agent')->group(function () {
    Route::post('login', [AgentAuthController::class, 'login']);
    Route::middleware('auth:sanctum')->post('logout', [AgentAuthController::class, 'logout']);
});

use App\Http\Controllers\VilleController;
use App\Http\Controllers\ResidenceController;
use App\Http\Controllers\AppartementController;
use App\Http\Controllers\PeriodeController;
use App\Http\Controllers\PreReservationController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ImageController;

Route::apiResource('villes', VilleController::class);
Route::apiResource('residences', ResidenceController::class);
Route::apiResource('appartements', AppartementController::class);
Route::apiResource('periodes', PeriodeController::class);
Route::apiResource('pre-reservations', PreReservationController::class);
Route::apiResource('reservations', ReservationController::class);
Route::post('images', [ImageController::class, 'store']);

Route::middleware('auth:sanctum')->put('reservations/{id}/valider', [ReservationController::class, 'validerReservation']);
Route::middleware('auth:sanctum')->post('reservations/{id}/upload-recu', [ReservationController::class, 'uploadRecu']);
Route::get('periodes/ville/{nom_ville}', [PeriodeController::class, 'getPeriodesParVille']);

Route::post('/images', [ImageController::class, 'store']);

Route::post('/appartements/with-image', [AppartementController::class, 'storeWithImage']);
Route::post('/agents/register', [AgentAuthController::class, 'register']);

