<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('job_offer_candidats', function (Blueprint $table) {
            $table->unsignedBigInteger('job_offer_id');
            $table->unsignedBigInteger('user_id');
            $table->integer('matching_percentage')->nullable();
            $table->timestamps();

            $table->primary(['job_offer_id', 'user_id']);
            $table->foreign('job_offer_id')->references('id')->on('job_offers')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_offer_candidats');
    }
};
