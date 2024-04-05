<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\CalendarSlot;
use Illuminate\Http\Request;
use App\Models\VideoCallToken;
use App\Models\CalendarReserved;
use App\Models\UserNotification;
use App\Http\Controllers\Controller;
use App\Events\UserNotificationEvent;

class InterviewsController extends Controller
{
    public function getUpcommingInterviews()
    {
        $currentDate = Carbon::now()->toDateString();

        $closestInterviews = CalendarSlot::where('status', 'reserved')
            ->where('day', '>=', $currentDate)
            ->orderBy('day')
            ->orderBy('start_time')
            ->get();

        $data = [];
        $i = 0;
        foreach ($closestInterviews as $interview) {
            $cr = CalendarReserved::where('slot_id', $interview->id)->first();
            $user = $cr->user;

            $data[$i]['id'] = $cr->id;
            $data[$i]['user_id'] = $user->id;
            $data[$i]['user_fname'] = $user->first_name;
            $data[$i]['user_lname'] = $user->last_name;
            $data[$i]['user_pic'] = $user->picture;
            $data[$i]['day'] = $interview->day;
            $data[$i]['start_time'] = $interview->start_time;
            $data[$i]['end_time'] = $interview->end_time;
            $i++;
        }

        return response()->json(['data' => $data]);
    }

    public function getUserUpcommingInterviews(Request $request)
    {
        $userReservedSlots = CalendarReserved::where('user_id', $request->user()->id)
            ->get();

        $data = [];
        $i = 0;
        foreach ($userReservedSlots as $slot) {
            $cs = CalendarSlot::where('id', $slot->slot_id)
                ->first();
            $date = Carbon::createFromFormat('Y-m-d', $cs->day);
            if ($date->isFuture() || $date->isSameDay(Carbon::today())) {
                $company = $cs->company;
                $data[$i]['id'] = $cs->id;
                $data[$i]['company_name'] = $company->name;
                $data[$i]['company_pic'] = $company->picture;
                $data[$i]['day'] = $cs->day;
                $data[$i]['start_time'] = $cs->start_time;
                $data[$i]['end_time'] = $cs->end_time;
                $i++;
            }
        }

        return response()->json(['data' => $data]);
    }

    public function generateToken(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $existingToken = VideoCallToken::where('company_id', $request->user()->id)
            ->where('user_id', $request->user_id)
            ->first();
        if ($existingToken) {
            UserNotification::create([
                'user_id' => $request->user_id,
                'from' => $request->user()->name,
                'type' => 'call',
                'content' => $existingToken->token
            ]);
            broadcast(new UserNotificationEvent($request->user_id));

            return response()->json(['token' => $existingToken->token]);
        }

        $uniqueString = md5($request->user_id . $request->user()->id . uniqid());
        VideoCallToken::create([
            'company_id' => $request->user()->id,
            'user_id' => $request->user_id,
            'token' => $uniqueString
        ]);

        UserNotification::create([
            'user_id' => $request->user_id,
            'from' => $request->user()->name,
            'type' => 'call',
            'content' => $uniqueString
        ]);
        broadcast(new UserNotificationEvent($request->user_id));

        return response()->json(['token' => $uniqueString]);
    }
}
