<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ResumeController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\JobOfferCandidatsController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;

Route::get('/verify-email/{id}/{hash}/{type}', VerifyEmailController::class)
    ->middleware(['signed', 'throttle:6,1'])
    ->name('verification.verify');
Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['throttle:6,1'])
    ->name('verification.send');

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');
Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::group(['middleware' => ['auth:sanctum', 'verified']], function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::get('/user', function (Request $request) {
        $user = $request->user();

        if ($user->tokenCan('user')) {
            $type = 'user';
        } elseif ($user->tokenCan('company')) {
            $type = 'company';
        } elseif ($user->tokenCan('admin')) {
            $type = 'admin';
        } else {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json([
            'user' => $user,
            'type' => $type,
        ]);
    });

    // resume 
    Route::get('/resumes', [ResumeController::class, 'index']);
    Route::post('/resumes', [ResumeController::class, 'store']);
    Route::post('/upload-resume', [ResumeController::class, 'upload']);
    Route::get('/download-resume/{filename}', [ResumeController::class, 'download']);
    Route::delete('/resumes/{resume}', [ResumeController::class, 'deleteResume']);

    // joboffers
    Route::get('/joboffers', [JobOfferController::class, 'index']);
    Route::post('/joboffers', [JobOfferController::class, 'store']);
    Route::get('/joboffers/{jobOffer}', [JobOfferController::class, 'show']);
    Route::put('/joboffers/{jobOffer}', [JobOfferController::class, 'update']);
    Route::delete('/joboffers/{jobOffer}', [JobOfferController::class, 'destroy']);

    //cadidats
    Route::get('/candidats/{jobOffer}', [JobOfferCandidatsController::class, 'index']);

    //getting a private resource (image, resume)
    Route::get('/storage/{folder}/{file}', function ($folder, $file) {
        $path = storage_path("app/$folder/$file");
        if (!file_exists($path)) {
            abort(404);
        }
        return response()->file($path);
    });
});
