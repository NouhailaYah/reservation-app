<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AgentAuthController extends Controller
{
    public function index()
    {
        $agents = Agent::all();  // récupère tous les agents de la table agents
        return response()->json($agents);  // retourne les agents au format JSON
    }
    
    // Inscription de l'agent
    public function register(Request $request)
    {
        // Validation des données
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'CIN' => 'required|string|max:20|unique:agents',
            'matricule' => 'required|string|max:20|unique:agents',
            'fonction' => 'required|string|max:255',
            'grade' => 'required|string|max:255',
            'service' => 'required|string|max:255',
            'login' => 'required|string|email|max:255|unique:agents',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $agent = Agent::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'CIN' => $request->CIN,
            'matricule' => $request->matricule,
            'fonction' => $request->fonction,
            'grade' => $request->grade,
            'service' => $request->service,
            'login' => $request->login,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Inscription réussie'], 201);
    }

    // Connexion de l'agent
    public function login(Request $req)
    {
        $validator = Validator::make($req->all(), [ 
            'login'     => 'required|string',
            'password'  => 'required|string'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $agent = Agent::where('login', $req->login)->first();

        if (!$agent) {
            return response()->json(['error' => 'Aucun compte trouve avec ce login. Voulez-vous creer un compte ?'], 404);
        }
        if (!Hash::check($req->password, $agent->password)) {
            return response()->json(['error' => 'Mot de passe incorrect'], 401);
        }
        
        // Création du token
        $token = $agent->createToken('AgentToken')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token, 
            'nom' => $agent->nom
        ], 200);
    }

    public function me(Request $request)
    {
    // Renvoie l'agent connecté via le middleware auth
        return response()->json($request->user());
    }

    // Déconnexion
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
