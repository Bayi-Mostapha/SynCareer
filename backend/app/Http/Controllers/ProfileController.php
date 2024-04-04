<?php

namespace App\Http\Controllers;

use App\Models\UserEducation;
use App\Models\UserExperience;
use App\Models\UserSkill;
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

        foreach ($user->experience as $exp) {
            $exp->delete();
        }
        foreach ($user->education as $edu) {
            $edu->delete();
        }
        foreach ($user->skills as $skill) {
            $skill->delete();
        }

        foreach ($request->experience as $exp) {
            UserExperience::create([
                'user_id' => $user->id,
                'beginning_date' => $exp['beginning_date'],
                'end_date' => $exp['end_date'],
                'position' => $exp['position'],
                'company_name' => $exp['company_name'],
            ]);
        }
        foreach ($request->education as $edu) {
            UserEducation::create([
                'user_id' => $user->id,
                'graduation_date' => $edu['graduation_date'],
                'school_name' => $edu['school_name'],
                'degree' => $edu['degree'],
            ]);
        }
        foreach ($request->skills as $skill) {
            UserSkill::create([
                'user_id' => $user->id,
                'content' => $skill['content'],
            ]);
        }

        return response()->json(['message' => 'Profile updated successfully'], 200);
    }

    public function getExperience(Request $request)
    {
        $exp = $request->user()->experience;
        return response()->json(['experience' => $exp]);
    }

    public function getEducation(Request $request)
    {
        $edu = $request->user()->education;
        return response()->json(['education' => $edu]);
    }

    public function getSkills(Request $request)
    {
        $skills = $request->user()->skills;
        return response()->json(['skills' => $skills]);
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
