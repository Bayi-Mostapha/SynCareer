<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMessagesTable extends Migration
{
    public function up()
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('conversation_id');
            $table->foreign('conversation_id')->references('id')->on('conversations')->onDelete('cascade');
            $table->unsignedBigInteger('user_sender_id')->nullable();
            $table->foreign('user_sender_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('company_sender_id')->nullable();
            $table->foreign('company_sender_id')->references('id')->on('companies')->onDelete('cascade');
            $table->string('sender_role'); // Role of the sender: user or company
            $table->text('content');
            $table->string('message_type')->default('text');
            $table->string('file_path')->nullable();
            $table->string('message_status')->default('sent');
            $table->timestamps();
        });
        
    }

    public function down()
    {
        Schema::dropIfExists('messages');
    }
}
