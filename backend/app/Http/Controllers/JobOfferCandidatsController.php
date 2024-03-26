<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use App\Models\Resume;
use Illuminate\Http\Request;

class JobOfferCandidatsController extends Controller
{
    public function index(Request $request, JobOffer $jobOffer)
    {
        $user = $request->user();
        if (!$user->tokenCan('company')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $this->authorize('viewCandidats', $jobOffer);

        $candidats = $jobOffer->candidats;
        $filteredCandidats = [];
        foreach ($candidats as $candidat) {
            $filteredCandidat = [
                'first_name' => $candidat['first_name'],
                'last_name' => $candidat['last_name'],
                'email' => $candidat['email'],
                'job_title' => $candidat['job_title'],
                'matching' => $candidat['pivot']['matching_percentage'],
            ];
            $filteredCandidats[] = $filteredCandidat;
        }
        return response()->json($filteredCandidats);
    }

    function apply(Request $request, JobOffer $jobOffer)
    {
        $user = $request->user();
        if (!$user->tokenCan('user')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $id = null;

        if ($request->resume_id) {
            $request->validate([
                'resume_id' => 'exists:resumes,id',
            ]);

            $id = $request->resume_id;

            $resume = Resume::find($id);
            $this->authorize('apply', $resume);
        }

        $jobOffer->candidats()->attach($user, [
            'matching_percentage' => 0,
            'resume_id' => $id
        ]);
    }
}
