<?php

use App\Models\Quiz;
use App\Models\User;
use App\Models\Report;
use App\Models\Company;
use App\Models\Message;
use App\Models\JobOffer;
use App\Models\Question;
use App\Models\PassesQuiz;
use App\Events\SendMessage;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Events\MessageAppear;
use App\Models\UserNotification;
use App\Events\SendMessageCompany;
use Illuminate\Support\Facades\DB;
use App\Events\UserNotificationEvent;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\AdminsController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResumeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\InterviewsController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\CompanyDashboardController;
use App\Http\Controllers\UserNotificationController;
use App\Http\Controllers\JobOfferCandidatsController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;

// GUEST
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

// AUTH USERS 
Route::group(['middleware' => 'auth:sanctum'], function () {
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
        } elseif ($user->tokenCan('super-admin')) {
            $type = 'super-admin';
        } else {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json([
            'user' => $user,
            'type' => $type,
        ]);
    });

    // admins crd
    Route::get('/admins', [AdminsController::class, 'index']);
    Route::post('/admins', [AdminsController::class, 'store']);
    Route::delete('/admins/{admin}', [AdminsController::class, 'destroy']);

    //notifications
    Route::get('/user-notifications', [UserNotificationController::class, 'index']);
    Route::post('/user-notifications', [UserNotificationController::class, 'markAllRead']);
    Route::post('/user-notifications/{notification}', [UserNotificationController::class, 'markRead']);

    // resume 
    Route::get('/resume/{resume}', [ResumeController::class, 'show']);
    Route::get('/resumes', [ResumeController::class, 'index']);
    Route::post('/resumes', [ResumeController::class, 'store']);
    Route::get('/download-resume/{filename}', [ResumeController::class, 'download']);
    Route::get('/download-resume-id/{resume}', [ResumeController::class, 'downloadById']);
    Route::delete('/resumes/{resume}', [ResumeController::class, 'deleteResume']);

    // joboffers
    Route::get('/joboffers', [JobOfferController::class, 'index']);
    Route::post('/joboffers', [JobOfferController::class, 'store']);
    Route::get('/joboffers/{jobOffer}', [JobOfferController::class, 'show']);
    Route::put('/joboffers/{jobOffer}', [JobOfferController::class, 'update']);
    Route::delete('/joboffers/{jobOffer}', [JobOfferController::class, 'destroy']);

    //cadidats
    Route::get('/candidats/{jobOffer}', [JobOfferCandidatsController::class, 'index']);
    Route::post('/apply/{jobOffer}', [JobOfferCandidatsController::class, 'apply']);
    Route::get('/candidat/{user}', [JobOfferCandidatsController::class, 'show']);

    //profilepage
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile-picture', [ProfileController::class, 'updatePicture']);

    //reports
    Route::post('/reports', [ReportController::class, 'store']);

    // Reda chat app
    Route::post('/sendMessage', function (Request $request) {
        $user = $request->user();
        $message = $request->validate([
            'message' => 'required|string',
        ]);
        $conversationId = $request->input(
            'conversationId'
        );
        $userId = $request->input(
            'userId'
        );
        $userType = $request->input(
            'userType'
        );

        // Find the conversation by ID
        $conversation = Conversation::find($conversationId);
        broadcast(new MessageAppear($userId, $conversationId));
        // If the conversation exists
        if ($conversation) {
            $conversation->update(['last_message_time' => now()]);
        }
        if ($user->tokenCan('user') == true) {
            $newMessage = new Message();
            $newMessage->conversation_id = $conversationId;
            $newMessage->user_sender_id = $user->id; // Assuming user is sending the message
            $newMessage->sender_role = "user"; // Assuming user is sending the message
            $newMessage->content = $message['message'];
            $newMessage->message_status = 'sent';
            $newMessage->save();

            $conversation = Conversation::find($conversationId);
            $messages = $conversation->messages()->get();
            $lastMessage = $messages->last();
            $FirstGroup = ($lastMessage && !($lastMessage->sender_role === 'user'));


            broadcast(new SendMessage(
                $message['message'],
                $conversationId,
                $FirstGroup,
                $userType
            ));
        } else {
            $newMessage = new Message();
            $newMessage->conversation_id = $conversationId;
            $newMessage->company_sender_id = $user->id; // Assuming user is sending the message
            $newMessage->sender_role = "company"; // Assuming user is sending the message
            $newMessage->content = $message['message'];
            $newMessage->message_status = 'sent';
            $newMessage->save();

            $conversation = Conversation::find($conversationId);
            $messages = $conversation->messages()->get();
            $lastMessage = $messages->last();
            $FirstGroup = ($lastMessage && !($lastMessage->sender_role === 'company'));

            broadcast(new SendMessageCompany(
                $message['message'],
                $conversationId,
                $FirstGroup,
                $userType
            ));
        }
    });
    Route::post('/updateMessageStatus', function (Request $request) {
        $conversationId = $request->input('conversation_id');
        if ($request->user()->tokenCan('user')) {
            $updated = Message::where('conversation_id', $conversationId)
                ->where('sender_role', 'company')
                ->update(['message_status' => 'read']);
        } else {
            $updated = Message::where('conversation_id', $conversationId)
                ->where('sender_role', 'user')
                ->update(['message_status' => 'read']);
        }

        if ($updated) {
            return response()->json(['message' => 'Message status updated successfully']);
        } else {
            return response()->json(['message' => 'No messages found or no update needed']);
        }
    });
    Route::get('/conversations', function (Request $request) {
        $userId = $request->user()->id;


        if ($request->user()->tokenCan('company')) {
            // Fetch conversations
            $conversations = Conversation::with(['user2', 'messages'])
                ->where('user2_id', $userId)
                ->orderBy('last_message_time', 'desc')
                ->get();

            // Prepare response data
            $responseData = [];
            foreach ($conversations as $conversation) {
                $lastMessage = $conversation->messages->last();
                $unreadMessagesCount = $conversation->messages->where('message_status', '!=', 'read')->where('user_sender_id', '!=', null)->count();
                $actualUserLastSender = $lastMessage ? ($lastMessage->company_sender_id ? true : false) : false;
                // Initialize lastSender as null for each conversation
                $lastSender = null;
                if ($lastMessage) {
                    $fileMessage = $lastMessage->content === "" ? $lastMessage->file_path : $lastMessage->content;
                }
                $conversationData = [
                    'conversation_id' => $conversation->id,
                    'user_id' => $conversation->user1_id,
                    'profile_pic' => $conversation->user1->picture,
                    'job_title' => $conversation->user1->job_title,
                    'name' => $conversation->user1->first_name . ' ' . $conversation->user1->last_name,
                    'last_message' => $lastMessage ? $fileMessage : null,
                    'last_message_time' => $lastMessage ? date('h:i', strtotime($lastMessage->created_at)) : null,
                    'actual_user_last_sender' => $actualUserLastSender,
                    'unread_messages_count' => $unreadMessagesCount,
                    'messages' => $conversation->messages->map(function ($message) use (&$lastSender) {
                        // Check if the sender of the current message is the same as the sender of the last message
                        $isFirstMessage = $lastSender !== $message->sender_role || $lastSender === null;
                        $lastSender = $message->sender_role;

                        return [
                            'message_id' => $message->id,
                            'content' => $message->content ? $message->content : $message->file_path,
                            'sender_role' => $message->sender_role,
                            'message_type' => $message->message_type,
                            'message_status' => $message->message_status,
                            'is_first_message' => $isFirstMessage,
                            'path' => $message->file_path,
                            'time' => date('h:i A', strtotime($message->created_at))
                        ];
                    }),
                    // Add other necessary fields
                ];

                $responseData[] = $conversationData;
            }
        } else {
            // Fetch conversations
            $conversations = Conversation::with(['user1', 'messages'])
                ->where('user1_id', $userId)
                ->orderBy('last_message_time', 'desc')
                ->get();

            // Prepare response data
            $responseData = [];
            foreach ($conversations as $conversation) {
                $lastMessage = $conversation->messages->last();
                $unreadMessagesCount = $conversation->messages->where('message_status', '!=', 'read')->where('company_sender_id', '!=', null)->count();
                $actualUserLastSender = $lastMessage ? ($lastMessage->user_sender_id ? true : false) : false;
                // Initialize lastSender as null for each conversation
                $lastSender = null;
                if ($lastMessage) {
                    $fileMessage = $lastMessage->content === "" ? $lastMessage->file_path : $lastMessage->content;
                }
                $conversationData = [
                    'conversation_id' => $conversation->id,
                    'user_id' => $conversation->user2_id,
                    'profile_pic' => $conversation->user2->picture,
                    'job_title' => $conversation->user2->first_name . ' ' . $conversation->user2->last_name,
                    'name' => $conversation->user2->name,
                    'last_message' => $lastMessage ? $fileMessage : null,
                    'last_message_time' => $lastMessage ? date('h:i', strtotime($lastMessage->created_at)) : null,
                    'actual_user_last_sender' => $actualUserLastSender,
                    'unread_messages_count' => $unreadMessagesCount,
                    'messages' => $conversation->messages->map(function ($message) use (&$lastSender) {
                        // Check if the sender of the current message is the same as the sender of the last message
                        $isFirstMessage = $lastSender !== $message->sender_role || $lastSender === null;
                        $lastSender = $message->sender_role;

                        return [
                            'message_id' => $message->id,
                            'content' => $message->content,
                            'sender_role' => $message->sender_role,
                            'message_type' => $message->message_type,
                            'message_status' => $message->message_status,
                            'is_first_message' => $isFirstMessage,
                            'path' => $message->file_path,
                            'time' => date('h:i A', strtotime($message->created_at))
                        ];
                    }),
                    // Add other necessary fields
                ];

                $responseData[] = $conversationData;
            }
        }

        return response()->json($responseData);
    });

    // Reda quiz
    Route::get('/quizzes', function (Request $request) {
        $company = $request->user();
        $quizzes = $company->quizzes;
        return response()->json($quizzes);
    });
    Route::get('/users', function (Request $request) {
        $users = User::select('id', DB::raw('CONCAT(first_name, " ", last_name) AS name'), 'job_title', 'email', DB::raw('COALESCE(phone_number, "__") AS phone_number'), 'created_at')->get();
        return response()->json($users);
    });
    
    Route::post('/uploadQuiz', function (Request $request) {
        $companyId = $request->user()->id;
        $quizDataArray = $request->input('quizData');
        $questions = $request->input('questions');

        $quiz = Quiz::create([
            'company_id' => $companyId,
            'name' => $quizDataArray['name'],
            'duration' => $quizDataArray['duration'],
            'nbr_question' => $quizDataArray['size']
        ]);

        foreach ($questions as $questionData) {
            Question::create([
                'quiz_id' => $quiz->id,
                'question_content' => $questionData['question'],
                'option_a' => $questionData['options'][0],
                'option_b' => $questionData['options'][1],
                'option_c' => $questionData['options'][2],
                'option_d' => $questionData['options'][3],
                'answer' => $questionData['answer'],
            ]);
        }

        return response()->json(['message' => 'Quiz data received successfully']);
    });
    Route::post('/send-quiz', function (Request $request) {
        $validated_data = $request->validate([
            'job_offer_id' => 'required|exists:job_offers,id',
            'quiz_id' => 'required|exists:quizzes,id',
            'users_ids.*' => 'required|exists:users,id'
        ]);

        $quizJobOffer = DB::table('quiz_joboffer')
            ->where('job_offer_id', $validated_data['job_offer_id'])
            ->first();
        if (!$quizJobOffer) {
            DB::table('quiz_joboffer')->insert([
                'quiz_id' => $validated_data['quiz_id'],
                'job_offer_id' => $validated_data['job_offer_id'],
                'created_at' => now(),
            ]);
        } else {
            if ($quizJobOffer->quiz_id != $validated_data['quiz_id']) {
                return response()->json(['message' => 'another quiz already exists for this job offer'], 403);
            }
        }

        $quiz = Quiz::find($validated_data['quiz_id']);
        foreach (json_decode($request['users_ids']) as $userId) {
            $data = [
                'user_id' => $userId,
                'quiz_id' => $validated_data['quiz_id'],
                'job_offer_id' => $validated_data['job_offer_id'],
                'status' => 'unpassed',
                'score' => 0
            ];
            $passes_quiz = PassesQuiz::create($data);

            UserNotification::create([
                'user_id' => $userId,
                'from' => $quiz->company->name,
                'type' => 'quiz',
                'content' => $passes_quiz->id
            ]);
            broadcast(new UserNotificationEvent($userId));
        }
        return response()->json(['message' => 'quiz sent to user(s) successfully']);
    });
    Route::get('/quiz-exists/{id}', function (Request $request, $id) {
        $quizJobOffer = DB::table('quiz_joboffer')
            ->where('job_offer_id', $id)
            ->first();
        if ($quizJobOffer) {
            return response()->json(['quiz_id' => $quizJobOffer->quiz_id]);
        }
        return response()->json(['quiz_id' => 0]);
    });
    Route::get('/quizzes/{id}', function (Request $request, $id) {
        $passesQuiz = PassesQuiz::findOrFail($id);
        $userId = $request->user()->id;

        if ($passesQuiz->status === 'passed') {
            return response()->json(null);
        }
        if ($passesQuiz->user_id !== $userId ) {
            return response()->json(null);
        }

        $quiz = $passesQuiz->quiz;

        if (!$quiz) {
            return response()->json('Quiz not found');
        }

        $responseData = [
            'id' => $quiz->id,
            'name' => $quiz->name,
            'duration' => $quiz->duration,
            'size' => $quiz->nbr_question,
            'data' => $quiz->questions,
        ];

        return response()->json($responseData);
    });

    Route::post('/calculateScore', function (Request $request) {
        $userId = $request->user()->id;
        try {
            $selectedAnswers = $request->input('selectedAnswers');
            $quizId = $request->input('quizId');

            $quiz = Quiz::find($quizId); 
            if ($quiz) {
                $quiz->increment('nbr_applicants');
            }
            
            $correctAnswers = Question::where('quiz_id', $quizId)->pluck('answer', 'id')->toArray();

            $score = 0;
            $totalQuestions = count($correctAnswers);
            
            // Iterate over the selected answers
            foreach ($selectedAnswers as $answer) {
                $questionId = $answer['id'];
                $selectedAnswer = $answer['selected'];

                // Check if the selected answer matches the correct answer  
                if (isset($correctAnswers[$questionId]) && $correctAnswers[$questionId] === $selectedAnswer) {
                    $score++;
                }
            }

            
            $percentageScore = ($score / $totalQuestions) * 100;
            // the problem is here 
         $pass = PassesQuiz::updateOrCreate(
            ['user_id' => $userId, 'quiz_id' => $quizId],
            ['score' => $percentageScore, 'status' => 'passed']
        );

            return response()->json(['success' => true, 'score' => $percentageScore]);
        } catch (\Exception $e) {
            // Return an error response to the client
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    });

    Route::post('/updateQuiz', function (Request $request) {
        try {
            $quizData = $request->input('quizData');
            $questions = $request->input('questions');
            $quizId = $request->input('quizId');

            // Attempt to find the quiz by its ID
            $quiz = Quiz::findOrFail($quizId);

            // Delete existing questions related to the quiz
            try {
                $quiz->questions()->delete();
            } catch (\Exception $e) {
                throw $e; // Re-throw the exception to be caught by the outer catch block
            }

            // Update quiz details
            try {
                $quiz->update([
                    'name' => $quizData['quizName'],
                    'duration' => $quizData['durationPerSecond'],
                    'nbr_question' => $quizData['numberOfQuestions']
                ]);
            } catch (\Exception $e) {
                throw $e; // Re-throw the exception to be caught by the outer catch block
            }

            // Create new questions for the quiz
            foreach ($questions as $questionData) {
                try {
                    $question = Question::create([
                        'quiz_id' => $quizId,
                        'question_content' => $questionData['question'],
                        'option_a' => $questionData['options'][0],
                        'option_b' => $questionData['options'][1],
                        'option_c' => $questionData['options'][2],
                        'option_d' => $questionData['options'][3],
                        'answer' => $questionData['answer'],
                    ]);
                } catch (\Exception $e) {
                    throw $e; // Re-throw the exception to be caught by the outer catch block
                }
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            // Return an error response to the client
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    });
    Route::delete('/quizzes/{quiz}', function (Quiz $quiz) {
        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found.'], 404);
        }

        // Perform deletion
        $quiz->delete();

        return response()->json(['message' => 'Quiz deleted successfully.']);
    });

    //getting a private ressource
    Route::get('/storage/{folder}/{file}', function ($folder, $file) {
        $path = storage_path("app/$folder/$file");
        if (!file_exists($path)) {
            return response()->json(['message' => 'File does not exist'], 404);
        }
        return response()->file($path);
    });

    // company dashboard
    Route::get('/job-offers-stats', [CompanyDashboardController::class, 'getJobOffersPerMonth']);
    Route::get('/applies-stats', [CompanyDashboardController::class, 'getAppliesPerMonth']);
    Route::get('/latest-applies', [CompanyDashboardController::class, 'getLatestApplies']);
    Route::get('/upcomming-interviews', [CompanyDashboardController::class, 'getUpcommingInterviews']);

    //company interviews
    Route::get('/all-upcomming-interviews', [InterviewsController::class, 'getUpcommingInterviews']);
    Route::post('/vid-token', [InterviewsController::class, 'generateToken']);

    //calendar
    Route::get('/calendar-exists/{jobOffer}', [JobOfferController::class, 'calendarExists']);
    Route::post('/send-calendar-candidats', [CalendarController::class, 'sendCalendar2Candidats']);
    Route::get('/reserved-slots', [CalendarController::class, 'getReservedSlots']);
    Route::post('/send-calendar', [CalendarController::class, 'sendCalendar']);
    Route::post('/schedule-interview', [CalendarController::class, 'scheduleInterview']);
    Route::get('/getCalendar/{id}', [CalendarController::class, 'getCalendar']);

    Route::get('/downloadFile/{filename}', function($filename) {
        $filePath = storage_path('app/fileUploads/'.$filename);
        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }
     return response()->file($filePath);
    });
    
    Route::post('/sendMessageFile', function (Request $request) {
        $user = $request->user();
        $conversationId = $request->input('conversationId');
        $userId = $request->input('userId');
        $userType = $request->input('userType');
        $fileName  = $request->input('fileName');

        broadcast(new MessageAppear($userId, $conversationId));

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $path = $file->storeAs('fileUploads', $fileName);

            $message = new Message();
            $message->conversation_id = $conversationId;
            $message->content = '';
            $message->message_type = 'file';
            $message->file_path = $path;

            if ($user->tokenCan('user') == true) {
                $message->sender_role = "user";
                $message->user_sender_id = $user->id;
                broadcast(new SendMessage(
                    $path,
                    $conversationId,
                    "true",
                    $userType
                ));
            } else {
                $message->sender_role = "company";
                $message->company_sender_id = $user->id;
                broadcast(new SendMessageCompany(
                    $path,
                    $conversationId,
                    "true",
                    $userType
                ));
            }

            $message->message_status = 'sent';
            $message->save();

            return response()->json(['path' => $path], 200);
        }

        return response()->json(['error' => 'File not provided'], 400);
    });

    Route::get('/reports/{id}', function(Request $request, $id){
        $reports = Report::where('job_offer_id', $id)->get();
        $formattedReports = [];
        foreach ($reports as $report) {
           
            $userName = $report->user->first_name . " " . $report->user->last_name ;
            $formattedCreatedAt = date('Y-m-d', strtotime($report->created_at));
            // Add the report data along with the user's name to the formattedReports array
            $formattedReports[] = [
                'id' => $report->id,
                'name' => $userName,
                'type' => $report->type,
                'description' => $report->description,
                'created_at' => $formattedCreatedAt,
                'jobOfferId' => $report->job_offer_id,
            ];
        }
    
        // Return the formatted report data
        return response()->json(['reports' => $formattedReports]);
    });
    Route::delete('/deleteReports/{id}', function(Request $request, $id){
     $jobOffer = JobOffer::findOrFail($id);
    $jobOffer->delete();
    });

    Route::get('/users/last-10', function() {
        $users = User::orderBy('created_at', 'desc')->limit(10)->get();
        return response()->json($users);
    });


    Route::get('/job-offers/last-10', function(){
        $jobOffers = JobOffer::with('company')->latest()->take(10)->get();

        $formattedJobOffers = $jobOffers->map(function ($jobOffer) {
            return [
                'id' => $jobOffer->id,
                'title' => $jobOffer->job_title,
                'company_name' => $jobOffer->company->name, 
            ];
        });

        return response()->json($formattedJobOffers);
    });
    Route::get('/counts', function() {
        // Get the counts of users, companies, job offers, and reports
        $userCount = User::count();
        $companyCount = Company::count();
        $jobOfferCount = JobOffer::count();
        $reportCount = Report::count();
    
        // Return the counts as a JSON response
        return response()->json([
            'user_count' => $userCount,
            'company_count' => $companyCount,
            'job_offer_count' => $jobOfferCount,
            'report_count' => $reportCount,
        ]);
    });
});
Broadcast::routes(['middleware' => ['auth:sanctum']]);
