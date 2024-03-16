<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\ValidationException;

class NewPasswordController extends Controller
{
    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8'],
        ]);

        $user = User::where('email', $validatedData['email'])->first();
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['User not found.'],
            ]);
        }

        $tokenExists = DB::table('password_reset_tokens')
            ->where('email', $validatedData['email'])
            ->where('token', $validatedData['token'])
            ->exists();
        if (!$tokenExists) {
            return response()->json(['message' => 'Invalid code'], 400);
        }

        $user->password = Hash::make($validatedData['password']);
        $user->remember_token = Str::random(60);
        $user->save();

        // event(new PasswordReset($user));

        DB::table('password_reset_tokens')->where('email', $validatedData['email'])->delete();

        return response()->json(['message' => 'Password reset successfully.']);
    }
}
