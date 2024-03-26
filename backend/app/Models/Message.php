<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $fillable = [
        'conversation_id', 'user_sender_id', 'company_sender_id', 'sender_role', 'content',
        'message_type', 'file_path', 'message_status',
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function userSender()
    {
        return $this->belongsTo(User::class, 'user_sender_id');
    }

    public function companySender()
    {
        return $this->belongsTo(Company::class, 'company_sender_id');
    }
}
