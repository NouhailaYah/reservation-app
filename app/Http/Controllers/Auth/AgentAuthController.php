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
    // Inscription de l'agent
    public function register(Request $request)
    {
        // Validation des données
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'required|string|max:20|unique:agents',
            'matricule' => 'required|string|max:20|unique:agents',
            'fonction' => 'required|string|max:255',
            'grade' => 'required|string|max:255',
            'service' => 'required|string|max:255',
            'login' => 'required|string|email|max:255|unique:agents',
            'password' => 'required|string|min:6|confirmed',
        ]);
        // Création de l'agent
        $agent = Agent::create([
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom'],
            'cin' => $validatedData['cin'],
            'matricule' => $validatedData['matricule'],
            'fonction' => $validatedData['fonction'],
            'grade' => $validatedData['grade'],
            'service' => $validatedData['service'],
            'login' => $validatedData['login'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $token = $agent->createToken('agent_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'token' => $token,
            'agent' => $agent
        ], 201);
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
        // $request->validate([
        //     'login' => 'required|email',
        //     'password' => 'required',
        // ]);

        // $agent = Agent::where('email', $request->email)->first();

        // if (!$agent || !Hash::check($request->password, $agent->password)) {
        //     return response()->json(['message' => 'Identifiants invalides'], 401);
        // }

        // $token = $agent->createToken('agent_token')->plainTextToken;

        // Mail::raw(
        //     "Bonjour {$agent->nom} {$agent->prenom}, vous vous êtes connecté avec succès.",
        //     function ($message) use ($agent) {
        //         $message->to($agent->email)
        //                 ->subject('Notification de Connexion - ORMVAH');
        //     }
        // );

        // return response()->json([
        //     'token' => $token,
        //     'agent' => $agent,
        //     'message' => 'Connexion réussie. Un email de notification a été envoyé.'
        // ]);


    // Déconnexion
    public function logout(Request $request)
    {
        $request->agent()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
