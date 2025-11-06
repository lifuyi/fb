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
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->comment('群组名称');
            $table->text('description')->nullable()->comment('群组描述');
            $table->string('avatar_url', 500)->nullable()->comment('群组头像');
            $table->tinyInteger('type')->default(0)->comment('0:公开 1:私有 2:官方');
            $table->foreignId('owner_id')->constrained('users')->comment('群主ID');
            $table->foreignId('university_id')->nullable()->constrained('universities')->comment('大学ID');
            $table->string('tags')->nullable()->comment('标签，逗号分隔');
            $table->integer('member_count')->default(0)->comment('成员数量');
            $table->integer('post_count')->default(0)->comment('帖子数量');
            $table->tinyInteger('status')->default(1)->comment('0:已禁用 1:正常');
            $table->timestamps();
            
            $table->index(['owner_id']);
            $table->index(['university_id']);
            $table->index(['type']);
            $table->index(['status']);
            $table->index(['member_count']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};