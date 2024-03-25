<?php

use App\Models\User;
use App\Models\Company;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('private.user.{id}', function ($user, $id) {
    $conversation = Conversation::find($id);
    // Check if the company exists and if it has a conversation with the given ID
    if ($conversation) {
        // Check if the conversation exists and if it's associated with the company
        if ($user->tokenCan('user') == true) {
            return true; 
        }
    }
    return false; 
});
Broadcast::channel('private.company.{id}', function ($user, $id) {
    $conversation = Conversation::find($id);
    // Check if the company exists and if it has a conversation with the given ID
    if ($conversation) {
        // Check if the conversation exists and if it's associated with the company
        if ($user->tokenCan('company') == true) {
            return true; 
        }
    }
    return false; 
});
Broadcast::channel('private.chat.{id}', function ($user, $id) {
    $userId = User::find($id);
    if($userId){
        if ($user->tokenCan('user')) {
            return true; 
        }
        if ($user->tokenCan('company')) {
            return true; 
        }
    }
    return false; 
});
Broadcast::channel('online', function ($user) {
    if ($user->tokenCan('user')) {
        return [
            'id' => $user->id,
            'name' => $user->first_name . ' ' . $user->last_name,
            'role' => 'user'
        ];
    }
    if ($user->tokenCan('company')) {
        return ['id' => $user->id, 'name' => $user->name,'role' => 'company' ];
    }
   
});
Broadcast::channel('onlineData', function ($user) {
    return true;
});



