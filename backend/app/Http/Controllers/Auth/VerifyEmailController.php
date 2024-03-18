<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Models\User;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request)
    {
        if (!$request->route('type')) {
            return response()->json(['message' => 'something is wrong'], 403);
        }

        if ($request->route('type') === 'company') {
            $user = Company::find($request->route('id'));
        } else if ($request->route('type') === 'user') {
            $user = User::find($request->route('id'));
        }

        if (!$user) {
            return response()->json(['message' => 'User not found'], 403);
        }

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
