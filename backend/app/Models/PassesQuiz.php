<?php

namespace App\Models;

use App\Models\Quiz;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PassesQuiz extends Model
{
    use HasFactory;
    protected $table = 'passes_quiz'; // Specify the table name

    protected $fillable = [
        'quiz_id',
        'user_id',
        'score',
        'status',
    ];
    public function quiz()
    {
        return $this->belongsTo(Quiz::class, 'quiz_id');
    }
}
