<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UserQuizNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    protected $to;
    protected $from;
    protected $id;

    public function __construct($to, $from, $id)
    {
        $this->to = $to;
        $this->from = $from;
        $this->id = $id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.notifications.' . $this->to),
        ];
    }

    public function broadcastAs()
    {
        return 'user-new-quiz';
    }

    public function broadcastWith(): array
    {
        return [
            'from' => $this->from,
            'quiz_id' => $this->id
        ];
    }
}
