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
        'job_offer_id',
    ];

    public function slots()
    {
        return $this->hasMany(CalendarSlot::class);
    }

    public function reservedUsers()
    {
        return $this->belongsToMany(User::class, 'calendar_reserved');
    }

    public function jobOffer()
    {
        return $this->belongsTo(JobOffer::class);
    }
}
