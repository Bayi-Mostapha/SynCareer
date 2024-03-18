<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'email already verified'], 403);
        }

        if (!hash_equals((string) $user->getKey(), (string) $request->route('id'))) {
            return response()->json(['message' => 'something went wrong, try again'], 422);
        }

        if (!hash_equals(sha1($user->getEmailForVerification()), (string) $request->route('hash'))) {
            return response()->json(['message' => 'something went wrong, try again'], 422);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json(['message' => 'email verified successfully'], 202);
    }
}
