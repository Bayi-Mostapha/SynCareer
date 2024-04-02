<?php

namespace App\Http\Controllers;


use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\JobOffer;
use Auth;

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

    public function saveJob(Request $request, JobOffer $jobOffer)
    {
        // Get the authenticated user
        $user = $request->user();

        // Attach the job offer to the user (assuming many-to-many relationship)
        $user->savedOffers()->attach($jobOffer);

        // Return a success response
        return response()->json(['message' => 'Job saved successfully']);
    }

    public function GetSavedJobs(Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // Retrieve the saved job offers for the user
        $savedJobOffers = $user->savedOffers;

        // Return the saved job offers as JSON response
        return response()->json($savedJobOffers);
    }

    public function delete(Request $request, JobOffer $jobOffer)
    {
        // Get the authenticated user
        $user = $request->user();

        // Detach the job offer from the user's saved offers
        $user->savedOffers()->detach($jobOffer);

        // Return a success response
        return response()->json(['message' => 'Job offer unsaved successfully']);
    }

    public function calendarExists(JobOffer $jobOffer)
    {
        if (!$jobOffer->calendar) {
            return response()->json(['exists' => false]);
        }
        return response()->json(['exists' => true]);
    }
}
