<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserExperience extends Model
{
    use HasFactory;

    protected $table = 'user_experience';

    protected $fillable = [
        'user_id',
        'beginning_date',
        'end_date',
        'position',
        'company_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
