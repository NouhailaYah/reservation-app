<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RedirectIfNotAgent
{
    public function handle($request, Closure $next)
    {
        if (!Auth::guard('agent')->check()) {
            return response()->json(['message' => 'Non autorisé - agent uniquement'], 401);
        }

        return $next($request);
    }
}

