<?php

namespace App\Models;

use App\Models\Report;
use App\Models\Resume;
use App\Models\JobOffer;
use App\Models\UserEducation;
use App\Models\UserExperience;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'job_title',
        'phone_number',
        'birthday',
        'email',
        'password',
        'picture',
        'bio',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function sendEmailVerificationNotification()
    {
        // We override the default notification and will use our own
        $this->notify(new EmailVerificationNotification("user"));
    }

    public function experiences()
    {
        return $this->hasMany(UserExperience::class);
    }

    public function educations()
    {
        return $this->hasMany(UserEducation::class);
    }

    public function savedOffers()
    {
        return $this->belongsToMany(JobOffer::class, 'user_saved_offers', 'user_id', 'offer_id')
            ->withTimestamps();
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function resumes()
    {
        return $this->hasMany(Resume::class);
    }
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'user_sender_id');
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class, 'user1_id');
    }
}
