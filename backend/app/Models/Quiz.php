<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Company;
use App\Models\Question;
use App\Models\PassesQuiz;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Quiz extends Model
{
    use HasFactory;
    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
    ];
    protected $fillable = [
        'company_id',
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
    public function passes()
    {
        return $this->hasMany(PassesQuiz::class,'quiz_id');
    }
}
