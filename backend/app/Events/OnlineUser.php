<?php
namespace App\Events;

use App\Events\OnlineUser;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class OnlineUser implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $users;
     /**
     * Create a new event instance.
     *
     * @param array $users
     */
    public function __construct(array $users)
    {
        $this->users = $users;
    }

     /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('onlineData'),
            
        ];
    }
    public function broadcastAs()
    {
        return 'onlinee';
    }
    public function broadcastWith(): array
    {
        return [
            'users' => $this->users,
        ];
    }
}
