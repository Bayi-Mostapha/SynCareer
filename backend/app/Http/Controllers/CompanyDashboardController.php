<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class CompanyDashboardController extends Controller
{
    public function getJobOffersPerMonth()
    {
        $endDate = Carbon::now()->lastOfMonth();
        $startDate = $endDate->copy()->subMonth(1)->startOfMonth();

        $result = [];

        for ($i = 0; $i < 12; $i++) {
            $monthName = $startDate->format('M');
            $jobOfferCount = JobOffer::whereBetween(
                'created_at',
                [$startDate, $endDate]
            )->count();

            $result[] = ['x' => $monthName, 'y' => $jobOfferCount];
            $endDate = $startDate->copy()->subDay()->lastOfMonth();
            $startDate = $endDate->copy()->startOfMonth();
        }
        return response()->json(['data' => $result]);
    }

    public function getAppliesPerMonth()
    {
        $endDate = Carbon::now()->lastOfMonth();
        $startDate = $endDate->copy()->subMonth(1)->startOfMonth();

        $result = [];

        for ($i = 0; $i < 12; $i++) {
            $monthName = $startDate->format('M');
            $applyCount = DB::table('job_offer_candidats')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count();

            $result[] = ['x' => $monthName, 'y' => $applyCount];
            $endDate = $startDate->copy()->subDay()->lastOfMonth();
            $startDate = $endDate->copy()->startOfMonth();
        }
        return response()->json(['data' => $result]);
    }
}
