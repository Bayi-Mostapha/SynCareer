<?php

namespace App\Models;

use App\Models\User;
use App\Models\Calendar;
use App\Models\CalendarSlot;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CalendarReserved extends Model
{
    use HasFactory;
    protected $table = 'calendar_reserved';
    protected $fillable = [
        'slot_id',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function slot()
    {
        return $this->belongsTo(CalendarSlot::class);
    }
}
