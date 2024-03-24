<?php

use Carbon\Carbon;
use App\Models\Quiz;
use App\Models\User;
use App\Models\Company;
use App\Models\Message;
use App\Models\Question;
use App\Events\OnlineUser;
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
                    'profile_pic' => $conversation->user1->picture,
                    'sender_name' => $conversation->user1->last_name . " " . $conversation->user1->first_name,
                    'user2_id' => $conversation->user1->id,
                    'sender_job_title' => $conversation->user1->job_title,
                    'last_message_time' => date('h:i A', strtotime($conversation->last_message_time)),
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
    
    
    Route::post('/updateMessageStatus', function (Request $request) {
        $conversationId = $request->input('conversation_id');
        if($request->user()->tokenCan('user')){
            $updated = Message::where('conversation_id', $conversationId)
            ->where('sender_role', 'company')
            ->update(['message_status' => 'read']);
        }else{
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
    Route::post('/onlineUsers', function (Request $request) {
        $users = $request->input('users');
        broadcast(new OnlineUser(
           $users
        ));
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
            'duration' => $quizDataArray['duration'], // Use 'duration' instead of 'size'
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
        $quiz = Quiz::with('questions')->findOrFail($id);

       
        return response()->json([
            'id' => $quiz->id,
            'name' => $quiz->name,
            'duration' => $quiz->duration,
            // 'size' => $quiz->nbr_question,
            'data' => $quiz->questions,
        ]);
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
