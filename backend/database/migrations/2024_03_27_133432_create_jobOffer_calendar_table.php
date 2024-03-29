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
        Schema::create('calendar_joboffers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('joboffer_id');
            $table->unsignedBigInteger('calendar_id');
            $table->integer('duration');

            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('calendar_id')->references('id')->on('calendar_slots')->onDelete('cascade');
            $table->foreign('joboffer_id')->references('id')->on('job_offers')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_joboffer');
    }
};
