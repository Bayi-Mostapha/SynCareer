<?php

namespace App\Policies;

use App\Models\Resume;
use App\Models\User;

class ResumePolicy
{
    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Resume $resume): bool
    {
        return $user->id === $resume->user_id;
    }
}
