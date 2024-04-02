<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobOfferSkill extends Model
{
    use HasFactory;

    protected $fillable=[
        'content',
        'job_offer_id'
    ];
}
