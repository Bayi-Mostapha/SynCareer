<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'birthday' => 'nullable|date',
            'bio' => 'nullable|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg',
        ]);

        $user = $request->user();
        $user->update($validatedData);

        return response()->json(['message' => 'Profile updated successfully'], 200);
    }

    function updatePicture(Request $request)
    {
        $request->validate([
            'picture' => 'required|image',
        ]);

        $imageName = '';
        if ($request->hasFile('picture')) {
            $image = $request->file('picture');
            $imageName = 'user_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('user-pictures', $imageName);
        } else {
            return response()->json(['message' => 'Please provide an image'], 422);
        }

        $user = $request->user();
        $user->update(['picture' => $imageName]);

        return response()->json(['message' => 'Image updated successfully'], 200);
    }
}
