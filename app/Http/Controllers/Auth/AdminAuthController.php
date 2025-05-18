<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => 'token',
            'admin' => 'admin',
        ], 200);
    
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants invalides.'],
            ]);
        }

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token,
            'admin' => $admin,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->admin()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Déconnexion réussie'
        ],200);
    }
}
