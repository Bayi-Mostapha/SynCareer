<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $user_id = Auth::id(); // Retrieve current user's ID

        $request->validate([
            'job_offer_id' => 'required|exists:job_offers,id',
            'type' => 'required',
            'description' => 'nullable',
        ]);

        try {

            $report = Report::create([
                'user_id' => $user_id,
                'job_offer_id' => $request->job_offer_id,
                'type' => $request->type,
                'description' => $request->description,
            ]);
            return response()->json(['message' => 'Report submitted successfully'], 201);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'You already reported this job offer'], 400);
        }
    }
}
