<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AgentAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required',
            'password' => 'required',
        ]);

        $agent = Agent::where('login', $request->login)->first();

        if (!$agent || !Hash::check($request->password, $agent->password)) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $token = $agent->createToken('agent_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'agent' => $agent,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }
}

