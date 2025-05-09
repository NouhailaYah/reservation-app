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
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'required|string|max:20|unique:agents',
            'matricule' => 'required|string|max:20|unique:agents',
            'fonction' => 'required|string|max:255',
            'grade' => 'required|string|max:255',
            'service' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:agents',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $agent = Agent::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'cin' => $request->cin,
            'matricule' => $request->matricule,
            'fonction' => $request->fonction,
            'grade' => $request->grade,
            'service' => $request->service,
            'email' => $request->email,
            'password' => Hash::make($request->password),
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

        // return response()->json([
        //     'message' => 'Connexion réussie',
        //     'token' => 'token',
        //     'admin' => 'admin',
        // ], 200);

        // $request->validate([
        //     'email' => 'required|email',
        //     'password' => 'required',
        // ]);


        // return response()->json([
        //     'message' => 'Connexion réussie',
        //     'token' => 'token',
        //     'admin' => 'admin',
        // ], 200);

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

        $validator = Validator::make($req->all(), [
            'email'     => 'required|string',
            'password'  => 'required|string'
          ]);

        if ($validator->fails()) {
        return response()->json($validator->errors());
        // return response()->json(["aaa" =>"aaajjj"]);
        }
        $user = Agent::where('email', $req->email)->first();
        if (!$user || !Hash::check($req->password, $user->password)) {
            return response()->json(['error' => 'Email or password is not matched'], 401);
        }
        
        $token = $user->createToken('AuthToken')->plainTextToken;
        $cookie = cookie('token', $token, 60);

        return response()->json(['token' => $token, "user" => $user], 200)->cookie( $cookie);
        




    }

    // Déconnexion
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}
