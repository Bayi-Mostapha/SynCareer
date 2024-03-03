<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $guards = ['user', 'company', 'admin'];
        $authenticatedGuard = null;

        foreach ($guards as $guard) {
            try {
                $request->authenticate($guard);
                $authenticatedGuard = $guard;
                break;
            } catch (ValidationException) {
                continue;
            }
        }

        if (!$authenticatedGuard) {
            return response()->json(['message' => 'wrong credentials'], 401);
        }

        $user = Auth::guard($authenticatedGuard)->user();
        $user->tokens()->delete();
        $token = $user->createToken('api-token', [$authenticatedGuard])->plainTextToken;

        return response()->json([
            'user' => $user,
            'type' => $authenticatedGuard,
            'token' => $token,
        ]);
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();

        return response()->json(['message' => 'logged out successfully']);
    }
}
