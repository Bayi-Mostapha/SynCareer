<?php

use Carbon\Carbon;
use App\Models\Quiz;
use App\Models\User;
use App\Models\Company;
use App\Models\Message;
use App\Models\Question;
use App\Events\OnlineUser;
use App\Models\PassesQuiz;
use App\Events\SendMessage;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Events\MessageAppear;
use App\Events\SendMessageCompany;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ResumeController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;

// GUEST
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

    Route::get('/resumes', [ResumeController::class, 'index']);
    Route::post('/store-resume', [ResumeController::class, 'store']);
    Route::get('/download-resume/{filename}', [ResumeController::class, 'download']);
    Route::delete('/delete-resume', [ResumeController::class, 'deleteResume']);

    //getting a private ressource (image, resume)



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
        broadcast(new MessageAppear($userId,$conversationId));
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
            $newMessage->message_status ='sent';
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
       
    }else{
        $newMessage = new Message();
        $newMessage->conversation_id = $conversationId;
        $newMessage->company_sender_id = $user->id; // Assuming user is sending the message
        $newMessage->sender_role = "company"; // Assuming user is sending the message
        $newMessage->content = $message['message'];
        $newMessage->message_status ='sent';
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
  
    Route::post('/fetchConversations', function (Request $request) {
   
    $type = $request->user()->tokenCan('user');
    if($type == true){
        $userId = $request->user()->id;
        $user = User::find($userId);
        $conversations = $user->conversations()
            ->with(['user2', 'messages']) // Eager load the related user2 and messages
            ->orderByDesc('last_message_time') // Order conversations by last_message_time in descending order
            ->get()
            ->map(function ($conversation) {
                $lastMessageContent = $conversation->messages->isNotEmpty() ? $conversation->messages->last()->content : null;
                return [
                    'conversation_id' => $conversation->id,
                    'profile_pic' => $conversation->user2->picture,
                    'sender_name' => $conversation->user2->name,
                    'user2_id' => $conversation->user2->id,
                    'last_message_time' => date('h:i A', strtotime($conversation->last_message_time)),
                    'last_message_content' => $lastMessageContent,
                    'unread_messages_count' => $conversation->messages()->where('sender_role', 'company')->where('message_status', 'sent')->count(),
                ];
            });
        
    }else{
        $userId = $request->user()->id;
        $user = Company::find($userId);
        $conversations = $user->conversations()
            ->with(['user1', 'messages']) // Eager load the related user1 and messages
            ->orderByDesc('last_message_time') // Order conversations by last_message_time in descending order
            ->get()
            ->map(function ($conversation) {
                $lastMessageContent = $conversation->messages->isNotEmpty() ? $conversation->messages->last()->content : null;
                return [
                    'conversation_id' => $conversation->id,
                    'jobOffer' => $conversation->user1->job_title,
                    'profile_pic' => $conversation->user1->picture ? $conversation->user1->picture : 'http://localhost:8000/images/default.jpg',
                    'sender_name' => $conversation->user1->last_name . " " . $conversation->user1->first_name,
                    'user2_id' => $conversation->user1->id,
                    'sender_job_title' => $conversation->user1->job_title,
                    'last_message_time' => $conversation->last_message_time ?  date('h:i A', strtotime($conversation->last_message_time)) : null,
                    'time' => $conversation->last_message_time,
                    'last_message_content' => $lastMessageContent,
                    'unread_messages_count' => $conversation->messages()->where('sender_role', 'user')->where('message_status', 'sent')->count(),
                ];
            });
        
    }
    return response()->json($conversations);
    });
    Route::post('/fetchMessages', function (Request $request) {
        $userId = $request->user()->id;
        $conversationId = $request->input('conversation_id');
        $conversation = Conversation::find($conversationId);
        if($conversation){
            $conversation->messages()
            ->where('user_sender_id', '!=', $userId)
            ->where('message_status', '!=', 'read')
            ->update(['message_status' => 'read']);

            $messages = $conversation->messages()
            ->orderBy('created_at', 'asc')
            ->select(
                'id' , 
                'user_sender_id',
                'company_sender_id',
                \DB::raw('IFNULL(user_sender_id, company_sender_id) AS sender_id'),
                \DB::raw('IF(user_sender_id IS NOT NULL, "user", "company") AS sender_type'),
                'message_type',
                'content',
                'message_status'
            )
            ->get();
        
            $prevSenderId = null;
            foreach ($messages as $message) {
                if ($message->sender_type !== $prevSenderId) {
                    $message->first_group = true;
                } else {
                    // Otherwise, mark as false
                    $message->first_group = false;
                }
                $prevSenderId = $message->sender_type;
            }
            $lastMessage = $messages->last();

            $isLast = ($lastMessage && $lastMessage->sender_id === $request->user()->id);
            if($messages){
                return response()->json([
                    'messages' => $messages,
                    'isLast' => $isLast
                ]);
            }else{
                return response()->json(['message' => 'No messages found or no update needed']);
            }
        }
        return response()->json(['message' => 'No messages found or no update needed', 'isLast' => false ]);
    });
    
    
    // Route::post('/updateMessageStatus', function (Request $request) {
    //     $conversationId = $request->input('conversation_id');
    //     if($request->user()->tokenCan('user')){
    //         $updated = Message::where('conversation_id', $conversationId)
    //         ->where('sender_role', 'company')
    //         ->update(['message_status' => 'read']);
    //     }else{
    //         $updated = Message::where('conversation_id', $conversationId)
    //         ->where('sender_role', 'user')
    //         ->update(['message_status' => 'read']);
    //     }

    //     if ($updated) {
    //         return response()->json(['message' => 'Message status updated successfully']);
    //     } else {
    //         return response()->json(['message' => 'No messages found or no update needed']);
    //     }
    // });
    Route::get('/conversations', function (Request $request) {
        $userId = $request->user()->id;
    
        // Fetch conversations
        $conversations = Conversation::with(['user2', 'messages'])
        ->where('user2_id', $userId)
        ->orderBy('last_message_time', 'desc')
        ->get();
    
       
        // Prepare response data
        $responseData = [];
        foreach ($conversations as $conversation) {
            $lastMessage = $conversation->messages->last();
            $unreadMessagesCount = $conversation->messages->where('message_status', '!=', 'read')->Where('user_sender_id','!=', 'null')->count();
            
            $actualUserLastSender = $lastMessage ? ($lastMessage->company_sender_id ? true : false) : false;
            $lastMessageTime = $lastMessage ? date('h:i A', strtotime($lastMessage->created_at)) : null;
            $conversationData = [
                'conversation_id' => $conversation->id,
                'user_id' => $conversation->user1_id,
                'profile_pic' => $conversation->user1->picture,
                'name' => $conversation->user1->first_name .' '.$conversation->user1->last_name,
                'last_message' => $lastMessage ? $lastMessage->content : null,
                'last_message_time' => $conversation->last_message_time,
                'unread_messages_count' => $unreadMessagesCount,
                'actual_user_last_sender' => $actualUserLastSender,
                'messages' => $conversation->messages->map(function ($message) {
                    return [
                        'message_id' => $message->id,
                        'content' => $message->content,
                        'sender_role' => $message->sender_role,
                        'message_type' => $message->message_type,
                        'message_status' => $message->message_status,
                    ];
                }),
                // Add other necessary fields
            ];
    
            $responseData[] = $conversationData;
        }
    
        return response()->json($responseData);
    });
    
    
    Route::post('/getQuizzes', function (Request $request) {
        $companyId = $request->user()->id;
        $quizzes = Quiz::where('company', $companyId)
        ->select('id', 'name', 'nbr_applicants', 'created_at')
        ->get();

    return response()->json($quizzes);
    });
    Route::post('/uploadQuiz', function (Request $request) {
        $companyId = $request->user()->id;
        $quizDataArray = $request->input('quizData');
        $questions = $request->input('questions');
        
        $quiz = Quiz::create([
            'company' => $companyId,
            'name' => $quizDataArray['name'],
            'duration' => $quizDataArray['duration'],
            'nbr_question' => $quizDataArray['size'] 
        ]);
        
        foreach ($questions as $questionData) {
            $question = Question::create([
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
    Route::get('/quizzes/{id}', function (Request $request, $id) {
        // Retrieve the PassesQuiz record by its ID
        $passesQuiz = PassesQuiz::findOrFail($id);
    
        // Check if the PassesQuiz record has a status of "inpassed"
        if ($passesQuiz->status === 'passed') {
            // If the status is "inpassed", return a response indicating that the quiz cannot be retrieved
            return response()->json('bad');
        }
    
        // Retrieve the associated quiz using the relationship defined in the PassesQuiz model
        $quiz = $passesQuiz->quiz;
    
        // Check if the quiz is empty
        if (!$quiz) {
            // If the quiz is empty, return an appropriate response
            return response()->json('Quiz not found');
        }
    
        // Load the questions relationship for the quiz
        $quiz->load('questions');
    
        // Prepare the response data
        $responseData = [
            'id' => $quiz->id,
            'name' => $quiz->name,
            'duration' => $quiz->duration,
            'size' => $quiz->nbr_question,
            'data' => $quiz->questions,
        ];
    
        // Return the response with the quiz details
        return response()->json($responseData);
    });
    
    
    Route::post('/calculateScore', function (Request $request) {
        try {
            $selectedAnswers = $request->input('selectedAnswers');
            $quizId = $request->input('quizId');
    
            // Get the correct answers for the quiz based on the quiz ID
            $correctAnswers = Question::where('quiz_id', $quizId)->pluck('answer', 'id')->toArray();
    
            $score = 0;
            $totalQuestions = count($correctAnswers);
    
            // Iterate over the selected answers
            foreach ($selectedAnswers as $answer) {
                $questionId = $answer['id'];
                $selectedAnswer = $answer['selected'];
    
                // Check if the selected answer matches the correct answer
                if (isset($correctAnswers[$questionId]) && $correctAnswers[$questionId] === $selectedAnswer) {
                    $score++; // Increment the score if the answer is correct
                }
            }
    
            // Calculate the percentage score
            $percentageScore = ($score / $totalQuestions) * 100;
            // or you can search by user id and quiz id 
            // $passesQuiz = PassesQuiz::findOrFail($passesQuizId);

            // // Update the score and status
            // $passesQuiz->update([
            //     'score' => $newScore,
            //     'status' => 'passed',
            // ]);

            // PassesQuiz::create([
            //     'quiz_id' => $quizId,
            //     'user_id' => $userId,
            //     'score' => 0,
            //     'status' => 'unpassed',
            // ]);
            return response()->json(['success' => true, 'score' => $percentageScore]);
        } catch (\Exception $e) {
            // Log the error to Laravel logs
            \Log::error('Error calculating score: ' . $e->getMessage());
    
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
            // Log the error to Laravel logs
            \Log::error('Error deleting questions for quiz: ' . $e->getMessage());
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
            // Log the error to Laravel logs
            \Log::error('Error updating quiz details: ' . $e->getMessage());
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
                // Log the error to Laravel logs
                \Log::error('Error creating question: ' . $e->getMessage());
                throw $e; // Re-throw the exception to be caught by the outer catch block
            }
        }

        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        // Log the error to Laravel logs
        \Log::error('Error uploading quiz: ' . $e->getMessage());

        // Return an error response to the client
        return response()->json(['success' => false, 'error' =>$e->getMessage()], 500);
    }
});



    Route::delete('/quizzes/{quiz}', function(Quiz $quiz){
        if (!$quiz) {
            return response()->json(['message' => 'Quiz not found.'], 404);
        }
    
        // Perform deletion
        $quiz->delete();
    
        return response()->json(['message' => 'Quiz deleted successfully.']);
    });

});
Route::get('/storage/{folder}/{file}', function ($folder, $file) {
    $path = storage_path("app/$folder/$file");
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});
Broadcast::routes(['middleware' => ['auth:sanctum']]);
