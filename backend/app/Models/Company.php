<?php

namespace App\Models;

use App\Models\JobOffer;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\EmailVerificationNotification;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Company extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone_number',
        'picture',
        'bio',
        'size',
        'website',
        'country',
        'city',
        'industry',
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
        $this->notify(new EmailVerificationNotification());
    }

    /**
     * Define a relationship with JobOffer model.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function jobOffers()
    {
        return $this->hasMany(JobOffer::class);
    }
}
