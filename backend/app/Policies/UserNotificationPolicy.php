<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserNotification;

class UserNotificationPolicy
{
    public function markRead(User $user, UserNotification $notification)
    {
        return $user->id === $notification->user_id;
    }
}
