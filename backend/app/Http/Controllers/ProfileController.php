<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'birthday' => 'nullable|date',
            'bio' => 'nullable|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Add validation rule for the picture
            // Add validation rules for other fields
        ]);

        // Check if picture file exists in the request
        if ($request->hasFile('picture')) {
            $image = $request->file('picture');

            // Generate a unique name for the image
            $imageName = time() . '_' . $image->getClientOriginalName();

            // Store the image
            $image->storeAs('public/user-pictures', $imageName);

            // Update the validated data with the image name
            $validatedData['picture'] = $imageName;
        }

        try {
            // Update the user's profile with the validated data
            $user = $request->user(); // Retrieve the authenticated user
            $user->update($validatedData);

            // Return a response indicating success
            return response()->json(['message' => 'Profile updated successfully'], 200);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Profile update failed: ' . $e->getMessage());

            // Return an error response
            return response()->json(['error' => 'Failed to update profile. Please try again later.'], 500);
        }
    }
}
