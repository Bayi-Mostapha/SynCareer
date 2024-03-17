<?php

namespace App\Http\Controllers;

use App\Models\JobOffer;
use Illuminate\Http\Request;

class JobOfferController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->tokenCan('company')) {
            $jobOffers = $user->jobOffers;
            return response()->json($jobOffers);
        } else {
            $jobOffers = JobOffer::all();
            return response()->json($jobOffers);
        }
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->tokenCan('company')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        // Validate the incoming request data
        $validatedData = $request->validate([
            'job_title' => 'required|string',
            'location' => 'required|string',
            'workplace_type' => 'required|string',
            'workhours_type' => 'required|string',
            'exp_years' => 'required|integer',
            'role_desc' => 'required|string',
        ]);
        // Assign company_id to the authenticated user's ID
        $validatedData['company_id'] = $user->id;
        // Create a new job offer instance
        $jobOffer = JobOffer::create($validatedData);

        // Return a response indicating success
        return response()->json(['message' => 'Job offer created successfully', 'jobOffer' => $jobOffer], 201);
    }

    public function show(JobOffer $jobOffer)
    {
        return response()->json($jobOffer);
    }

    public function update(Request $request, JobOffer $jobOffer)
    {
        $user = $request->user();
        if (!$user->tokenCan('company')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $this->authorize('update', $jobOffer);
        // Validate the incoming request data
        $validatedData = $request->validate([
            'job_title' => 'string',
            'location' => 'string',
            'workplace_type' => 'string',
            'workhours_type' => 'string',
            'exp_years' => 'integer',
            'role_desc' => 'string',
        ]);

        // Update the job offer with the validated data
        $jobOffer->update($validatedData);

        // Return a response indicating success or redirect to a new page
        return response()->json(['message' => 'Job offer updated successfully', 'jobOffer' => $jobOffer]);
    }



    public function destroy(Request $request, JobOffer $jobOffer)
    {
        $user = $request->user();
        if (!$user->tokenCan('company')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $this->authorize('delete', $jobOffer);
        $jobOffer->delete();
        return response()->json(['message' => 'Job offer deleted successfully']);
    }
}
