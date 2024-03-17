<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\JobOffer;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\AuthorizationException;


class JobOfferPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(Company $company, JobOffer $jobOffer): bool
    {
        return $company->id === $jobOffer->company_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(Company $company, JobOffer $jobOffer)
    {
        return $company->id === $jobOffer->company_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Company $user, JobOffer $jobOffer): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Company $user, JobOffer $jobOffer): bool
    {
        return false;
    }
}
