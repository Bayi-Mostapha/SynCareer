<?php

namespace App\Models;

use App\Models\User;
use App\Models\Company;
use App\Models\JobOffer;
use App\Models\CalendarSlot;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Calendar extends Model
{  
    use HasFactory;
    protected $table = 'calendars';  
    protected $fillable = [
        'company_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function slots()
    {
        return $this->hasMany(CalendarSlot::class);
    }

    public function reservedUsers()
    {
        return $this->belongsToMany(User::class, 'calendar_reserved');
    }

    public function jobOffers()
    {
        return $this->belongsToMany(JobOffer::class, 'calendar_joboffers');
    }
}
