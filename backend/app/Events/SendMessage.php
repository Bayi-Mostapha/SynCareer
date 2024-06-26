<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class sendMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $message;
    public  $conversationId;
    // public  $firstGroup;
    public  $userType;
    public  $msgType;

    /**
     * Create a new event instance.
     */
    public function __construct($message, $conversationId, $userType, $msgType)
    {
        $this->message = $message;
        $this->conversationId = $conversationId;
        // $this->firstGroup = $firstGroup;
        $this->userType = $userType;
        $this->msgType = $msgType;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('private.company.' . $this->conversationId),
            
        ];
    }
    public function broadcastAs()
    {
        return 'chatUser';
    }
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'conversationId' => $this->conversationId,
            // 'first_group' => $this->firstGroup ,
            'sender_type' => $this->userType,
            'msgType' => $this->msgType,
        ];
    }
}

