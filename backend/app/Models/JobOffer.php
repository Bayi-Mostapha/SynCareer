<?php

namespace App\Models;

use App\Models\User;
use App\Models\Report;
use App\Models\Company;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_title',
        'location',
        'workplace_type', //hybride, on-site, remote
        'workhours_type', //full-time, part-time, contract, temporary, ...
        'exp_years',
        'role_desc',
        'company_id',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function candidats()
    {
        return $this->belongsToMany(User::class, 'job_offer_candidats', 'job_offer_id', 'user_id')
            ->withPivot('matching_percentage');
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
