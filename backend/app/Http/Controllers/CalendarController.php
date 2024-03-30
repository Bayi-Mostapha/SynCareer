<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Calendar;
use App\Models\CalendarSlot;
use Illuminate\Http\Request;
use App\Models\CalendarReserved;


class CalendarController extends Controller
{
    public function getReservedSlots(Request $request)
    {
        $reservedSlots = CalendarSlot::where('company_id', $request->user()->id)
        ->distinct()
        ->pluck('day')
        ->toArray();
        return response()->json($reservedSlots);
    }
    public function sendCalendar(Request $request)
    {
        $selectedDays = $request->input('selectedDays');
        $calendar = Calendar::create([
            'company_id' => $request->user()->id,
        ]);
        foreach ($selectedDays as $selectedDay) {
            try {
                $day = Carbon::parse($selectedDay['day']); // No need for toDateString()
                if ($day === null) {
                    return response()->json(['success' => false, 'message' => 'Invalid day format'], 400);
                }
    
                $slots = $selectedDay['slots'];
                
                foreach ($slots as $slot) {
                    try {
                        $startTime = Carbon::parse($slot['startTime']);
                        $endTime = Carbon::parse($slot['endTime']);
                        // Duration in minutes
                        
                        // Iterate until the end time is reached
                        while ($startTime < $endTime) {
                            // Calculate end time based on duration
                            $endTimeSlot = $startTime->copy()->addMinutes(60);
                            if ($endTimeSlot > $endTime) {
                                $endTimeSlot = $endTime;
                            }else{
                                CalendarSlot::create([
                                    'calendar_id' => $calendar->id,
                                    'company_id' => $request->user()->id,
                                    'day' => $day,
                                    'start_time' => $startTime->format('H:i'),
                                    'end_time' => $endTimeSlot->format('H:i'),
                                    'status' => 'free', 
                                ]);
                            }
                            // Move to the next start time
                            $startTime = $endTimeSlot;
                        }
                    } catch (\Exception $e) {
                        return response()->json(['success' => false, 'message' => 'Failed to insert slot: ' . $e->getMessage()], 500);
                    }
                }
            } catch (\Exception $e) {
                return response()->json(['success' => false, 'message' => 'Failed to process day: ' . $e->getMessage()], 500);
            }
        }
    
        return response()->json(['success' => true, 'message' => 'Slots inserted successfully'], 200);
    }
    public function scheduleInterview(Request $request){
        $userId = $request->user()->id;
        // $calendarId = $request->input('calendarId');
        // $day = $request->input('day');
        $slotId = $request->input('slotId');
         
        $calendarReserved = CalendarReserved::create([
            'slot_id' => $slotId,
            'user_id' => $userId,
        ]);

        // Update the status of the CalendarSlot to 'reserved'
        $calendarSlot = CalendarSlot::findOrFail($slotId);
        $calendarSlot->status = 'reserved';
        $calendarSlot->save();
        return response()->json(['success' => true, 'message' => 'interview done '], 200);
    }
    public function getCalendar(Request $request, $id){
        $userId = $request->user()->id;
        try {
            $calendar = Calendar::findOrFail($id);
            $calendarData = [];
            $days = CalendarSlot::where('status', 'free')
            ->where('company_id', $calendar->company_id)
            ->distinct()
            ->pluck('day')
            ->toArray();

            foreach ($calendar->slots as $slot) {
                if($slot->status === "free"){
                    $day = $slot->day;
                    $slotData = [
                        'starttime' => $slot->start_time,
                        'endtime' => $slot->end_time ,
                        'id' => $slot->id
                    ];
                    // Check if the day already exists in $calendarData
                    if (array_key_exists($day, $calendarData)) {
                        // If the day already exists, push the slot data to its slots array
                        array_push($calendarData[$day]['slots'], $slotData);
                    } else {
                        // If the day doesn't exist, create a new entry with the day and slots array
                        $calendarData[$day] = [
                            'day' => $day,
                            'slots' => [$slotData]
                        ];
                    }
                }
            }
            // Convert the associative array to indexed array and return
            $calendarData = array_values($calendarData);
            return response()->json(['calendar'=>$calendarData,'days'=>$days]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Calendar not found'], 404);
        }
    }
    
}
