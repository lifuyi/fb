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
        Schema::create('group_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('role')->default(0)->comment('0:成员 1:管理员 2:群主');
            $table->tinyInteger('status')->default(1)->comment('0:已退出 1:正常');
            $table->text('remark')->nullable()->comment('备注');
            $table->timestamp('joined_at')->nullable()->comment('加入时间');
            $table->timestamps();
            
            $table->unique(['group_id', 'user_id']);
            $table->index(['user_id']);
            $table->index(['role']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('group_members');
    }
};