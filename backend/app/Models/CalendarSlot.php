<?php

namespace App\Models;

use App\Models\Company;
use App\Models\Calendar;
use App\Models\CalendarJobOffer;
use App\Models\CalendarReserved;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CalendarSlot extends Model
{
    use HasFactory;
    protected $table = 'calendar_slots'; 
    protected $fillable = [
        'calendar_id',
        'company_id',
        'day',
        'start_time',
        'end_time',
        'status',
    ];

    public function calendar()
    {
        return $this->belongsTo(Calendar::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
