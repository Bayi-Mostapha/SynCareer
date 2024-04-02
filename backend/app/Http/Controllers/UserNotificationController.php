<?php

namespace App\Http\Controllers;

use App\Models\PassesQuiz;
use App\Models\Quiz;
use App\Models\UserNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserNotificationController extends Controller
{
    function index(Request $request)
    {
        $user = $request->user();
        if (!$user->tokenCan('user')) {
            return response()->json(['message' => 'forbidden'], 403);
        }
        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();
        return response()->json($notifications);
    }

    function markAllRead(Request $request)
    {
        $user = $request->user();
        if (!$user->tokenCan('user')) {
            return response()->json(['message' => 'forbidden'], 403);
        }
        try {
            $user->notifications()
                ->where('read', '0')
                ->update(['read' => '1']);
        } catch (\Throwable $th) {
            return response()->json('bad', 422);
        }
    }

    function markRead(Request $request, UserNotification $notification)
    {
        $user = $request->user();
        if (!$user->tokenCan('user')) {
            return response()->json(['message' => 'forbidden'], 403);
        }
        $this->authorize('markRead', $notification);
        $notification->update(["read" => "1"]);
    }
}
