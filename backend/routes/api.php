<?php

use Dompdf\Dompdf;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;

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

Route::group(['middleware' => 'auth:sanctum'], function () { //,admin,company
    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');

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

    Route::post('/store-resume', function (Request $request) {
        $validatedData = $request->validate([
            'html_content' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
        ]);

        $dompdf = new Dompdf();
        $dompdf->loadHtml($validatedData['html_content']);
        $dompdf->render();
        $pdfContent = $dompdf->output();
        $fileName = 'resume_' . uniqid() . '.pdf';
        $filePath = 'resumes/' . $fileName;
        Storage::put($filePath, $pdfContent);

        $image = $request->file('image');
        $imageName = 'image_' . uniqid() . '.' . $image->getClientOriginalExtension();
        $image->storeAs('resume-images', $imageName);

        Resume::create([
            'user_id' => $request->user()->id,
            'resume_name' => $fileName,
            'image_name' => $imageName,
        ]);

        return response()->json([
            'message' => 'Resume saved successfully',
            'fileName' => $fileName
        ]);
    });

    Route::get('/download-resume/{filename}', function (Request $request, $filename) {
        $user = $request->user();
        $resume = Resume::where('user_id', $user->id)
            ->where('resume_name', $filename)
            ->first();
        if (!$resume) {
            abort(404);
        }

        $filePath = storage_path('app/resumes/' . $filename);
        if (!file_exists($filePath)) {
            abort(404);
        }
        return response()->download($filePath, $filename);
    });

    //getting a private ressource (image, resume)
    // Route::get('/storage/{folder}/{file}', function ($folder, $file) {
    //     $path = storage_path("app/{$folder}/{$file}");
    //     if (!file_exists($path)) {
    //         abort(404);
    //     }
    //     return response()->file($path);
    // });
});
