<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $type = $request->validate([
            'type' => 'required|string|in:user,company'
        ])['type'];

        $user = null;

        if ($type === 'user') {
            $validatedData = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'job_title' => 'nullable|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:8',
            ]);

            $user = User::create([
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'email' => $validatedData['email'],
                'job_title' => $validatedData['job_title'],
                'password' => Hash::make($validatedData['password']),
            ]);
        } else if ($type === 'company') {
            $validatedData = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:companies',
                'password' => 'required|string|min:8',
                'country' => 'required|string|max:255',
                'city' => 'nullable|string|max:255',
                'industry' => 'nullable|string|max:255',
                'size' => 'nullable|string|max:255',
            ]);
            $user = Company::create([
                'first_name' => $validatedData['first_name'],
                'last_name' => $validatedData['last_name'],
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'country' => $validatedData['country'],
                'city' => $validatedData['city'],
                'industry' => $validatedData['industry'],
                'size' => $validatedData['size'],
            ]);
        } else {
            return response()->json(['message' => 'Invalid type'], 400);
        }

        if ($user === null) {
            return response()->json(['message' => 'Failed to create user'], 500);
        }

        event(new Registered($user));
        return response()->json(['message' => 'Account created successfully']);
    }
}
