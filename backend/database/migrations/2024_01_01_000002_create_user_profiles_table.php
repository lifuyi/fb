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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nickname', 50)->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->text('bio')->nullable();
            $table->tinyInteger('gender')->default(0)->comment('0:未知 1:男 2:女');
            $table->smallInteger('birth_year')->nullable();
            $table->foreignId('university_id')->nullable()->constrained('universities');
            $table->string('major', 100)->nullable();
            $table->smallInteger('graduation_year')->nullable();
            $table->json('skills')->nullable()->comment('技能标签');
            $table->timestamps();
            
            $table->index(['university_id']);
            $table->index(['major']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};