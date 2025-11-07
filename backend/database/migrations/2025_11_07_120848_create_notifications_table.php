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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->comment('接收通知的用户ID');
            $table->tinyInteger('type')->comment('1:点赞 2:评论 3:关注 4:系统通知');
            $table->string('title', 100)->comment('通知标题');
            $table->text('content')->comment('通知内容');
            $table->json('data')->nullable()->comment('附加数据');
            $table->tinyInteger('is_read')->default(0)->comment('0:未读 1:已读');
            $table->timestamps();
            
            $table->index(['user_id', 'is_read']);
            $table->index(['type']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
