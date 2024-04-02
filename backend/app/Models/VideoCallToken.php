<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoCallToken extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_id',
        'token'
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
