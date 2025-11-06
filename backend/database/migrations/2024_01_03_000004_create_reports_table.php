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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('target_type')->comment('1:帖子 2:评论 3:用户 4:群组');
            $table->foreignId('target_id')->comment('目标ID');
            $table->tinyInteger('reason')->comment('1:垃圾信息 2:违法内容 3:人身攻击 4:其他');
            $table->text('description')->nullable()->comment('举报描述');
            $table->tinyInteger('status')->default(0)->comment('0:待处理 1:已处理 2:已忽略');
            $table->text('admin_remark')->nullable()->comment('管理员备注');
            $table->foreignId('handled_by')->nullable()->constrained('users')->comment('处理人');
            $table->timestamp('handled_at')->nullable()->comment('处理时间');
            $table->timestamps();
            
            $table->index(['target_type', 'target_id']);
            $table->index(['reporter_id']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};