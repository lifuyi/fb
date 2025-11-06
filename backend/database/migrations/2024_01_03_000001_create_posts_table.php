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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('content')->comment('帖子内容');
            $table->tinyInteger('type')->default(0)->comment('0:文字 1:图片 2:链接 3:视频');
            $table->json('images')->nullable()->comment('图片URL数组');
            $table->string('link_url')->nullable()->comment('链接URL');
            $table->string('link_title')->nullable()->comment('链接标题');
            $table->string('link_image')->nullable()->comment('链接预览图');
            $table->string('link_description')->nullable()->comment('链接描述');
            $table->integer('like_count')->default(0)->comment('点赞数');
            $table->integer('comment_count')->default(0)->comment('评论数');
            $table->integer('share_count')->default(0)->comment('分享数');
            $table->tinyInteger('status')->default(1)->comment('0:已删除 1:正常');
            $table->timestamp('pinned_at')->nullable()->comment('置顶时间');
            $table->timestamps();
            
            $table->index(['group_id', 'created_at']);
            $table->index(['user_id']);
            $table->index(['type']);
            $table->index(['status']);
            $table->index(['pinned_at']);
            $table->index(['like_count']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};