<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function build()
    {
        return $this->view('password-reset-email')
            ->with(['token' => $this->token])
            ->subject('Password Mail');
    }

    public function attachments()
    {
        return [];
    }
}
