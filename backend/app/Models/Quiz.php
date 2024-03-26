<?php

namespace App\Models;

use App\Models\Quiz;
use App\Models\Company;
use App\Models\Question;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Quiz extends Model
{
    use HasFactory;
    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
    ];
    protected $fillable = [
        'company',
        'name',
        'duration',
        'nbr_applicants',
        'nbr_question'
    ];

    // Define the relationship with the Company model
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    // Define the relationship with the Question model
    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
