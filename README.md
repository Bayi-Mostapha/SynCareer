# Syncareer
docs :)
## Backend
### CRUD using eloquent relashionships

- **how to insert a new candidate for a job offer:**

`$jobOffer->candidats()->attach($user, ['matching_percentage' => $x]);`

$user and $jobOffer are eloquent models, so get your user using a user_id `User::find($user_id)` or the current user `$user = $request->user();`, and your jobOffer using an offer_id `JobOffer::find($offer_id)`, leave x as a 0 for now

- **how to remove an apply**
`$jobOffer->candidats()->detach($user);`

- **how to get applies for a job offer**
`$candidats = $jobOffer->candidats;`

<hr>

- **to get saved job offers:**
`$savedJobOffers = $user->savedOffers;`
 
- **to save an offer:**
`$user->savedOffers()->attach($jobOffer);`

- **to unsave:**
`$user->savedOffers()->detach($jobOfferId);`

- **to retrieve all saved offers for a user:**
`$savedJobOffers = $user->savedOffers;`

### CRUD using models
*you can use basic models and controllers crud for these tables*

- reports has a model
- user experience has a model
- user education has a model

## Frontend
to work with a tabel fist import DataTable, provide it with columns data and seach column
`<DataTable columns={columns} data={data} searchColumn={"email"} />`
- columns are defined for each table, check components/company/job-offers-table to know how to make one, you can add "sorting by" column and action like i did
- data is fetched from server, make sure that data structure is like columns
- seachColumn is the column used for seach