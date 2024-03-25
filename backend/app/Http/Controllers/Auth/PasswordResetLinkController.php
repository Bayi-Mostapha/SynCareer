<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Mail\PasswordMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $validated_data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated_data['email'])->first();
        if (!$user) {
            return response()->json(['message' => 'email does not exist'], 404);
        }

        if ($user instanceof MustVerifyEmail && !$user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Your email address is not verified.'], 409);
        }

        $token = random_int(100000, 999999);

        try {
            DB::table('password_reset_tokens')->insert([
                'email' => $validated_data['email'],
                'token' => $token,
                'created_at' => now(),
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Code already sent, check your email'], 400);
        }

        Mail::to($validated_data['email'])->send(new PasswordMail($token));
        return response()->json(['message' => 'check your email']);

        // $status = Password::sendResetLink(
        //     $request->only('email')
        // );

        // if ($status != Password::RESET_LINK_SENT) {
        //     throw ValidationException::withMessages([
        //         'email' => [__($status)],
        //     ]);
        // }

        // return response()->json(['status' => __($status)]);
    }
}
