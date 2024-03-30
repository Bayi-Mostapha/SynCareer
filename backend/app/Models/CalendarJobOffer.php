<?php

namespace App\Models;

use App\Models\Company;
use App\Models\Calendar;
use App\Models\JobOffer;
use App\Models\CalendarSlot;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CalendarJobOffer extends Model
{
    use HasFactory;
    protected $table = 'calendar_joboffers'; 
    protected $fillable = [
        'company_id',
        'joboffer_id',
        'calendar_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function jobOffer()
    {
        return $this->belongsTo(JobOffer::class);
    }

    public function calendar()
    {
        return $this->belongsTo(Calendar::class);
    }
}
