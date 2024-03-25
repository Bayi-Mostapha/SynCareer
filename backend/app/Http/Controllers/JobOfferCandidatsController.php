<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
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
}
