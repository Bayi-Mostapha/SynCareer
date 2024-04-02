<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\CalendarReserved;
use App\Models\CalendarSlot;
use App\Models\User;

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
        $result = array_reverse($result);

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
        $result = array_reverse($result);

        return response()->json(['data' => $result]);
    }

    public function getLatestApplies()
    {
        $latestApplies = DB::table('job_offer_candidats')
            ->orderByDesc('created_at')
            ->limit(4)
            ->get();


        $data = [];
        $i = 0;
        foreach ($latestApplies as $apply) {
            $user = User::find($apply->user_id);
            $jobOffer = JobOffer::find($apply->job_offer_id);

            $data[$i]['id'] = $apply->user_id . $apply->job_offer_id;
            $data[$i]['user_name'] = $user->first_name;
            $data[$i]['job_offer_title'] = $jobOffer->job_title;
            $data[$i]['location'] = $jobOffer->location;
            $data[$i]['date'] = $apply->created_at;
            $i++;
        }

        return response()->json(['data' => $data]);
    }

    public function getUpcommingInterviews()
    {
        $currentDate = Carbon::now()->toDateString();

        $closestInterviews = CalendarSlot::where('status', 'reserved')
            ->where('day', '>=', $currentDate)
            ->orderBy('day')
            ->orderBy('start_time')
            ->limit(4)
            ->get();

        $data = [];
        $i = 0;
        foreach ($closestInterviews as $interview) {
            $cr = CalendarReserved::where('slot_id', $interview->id)->first();
            $user = $cr->user;

            $data[$i]['id'] = $cr->id;
            $data[$i]['user_name'] = $user->first_name;
            $data[$i]['user_pic'] = $user->picture;
            $data[$i]['day'] = $interview->day;
            $data[$i]['start_time'] = $interview->start_time;
            $data[$i]['end_time'] = $interview->end_time;
            $i++;
        }

        return response()->json(['data' => $data]);
    }
}
