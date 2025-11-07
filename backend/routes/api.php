<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NotificationController;

// 认证相关路由
Route::prefix('auth')->group(function () {
    // 邮箱注册
    Route::post('email-register', [AuthController::class, 'emailRegister']);
    
    // 手机号注册
    Route::post('phone-register', [AuthController::class, 'phoneRegister']);
    // 微信登录
    Route::post('wechat-login', [AuthController::class, 'wechatLogin']);
    
    // 手机号登录
    Route::post('phone-login', [AuthController::class, 'phoneLogin']);
    
    // 邮箱登录
    Route::post('email-login', [AuthController::class, 'emailLogin']);
    
    // 发送短信验证码
    Route::post('send-sms-code', [AuthController::class, 'sendSmsCode']);
    
    // 需要认证的路由
    Route::middleware('auth:sanctum')->group(function () {
        // 退出登录
        Route::post('logout', [AuthController::class, 'logout']);
        
        // 刷新token
        Route::post('refresh-token', [AuthController::class, 'refreshToken']);
        
        // 获取用户信息
        Route::get('user', [AuthController::class, 'user']);
        
        // 更新用户资料
        Route::put('profile', [AuthController::class, 'updateProfile']);
    });
});

// 群组相关路由
Route::prefix('groups')->middleware('auth:sanctum')->group(function () {
    // 获取群组列表
    Route::get('/', [GroupController::class, 'index']);
    
    // 获取群组详情
    Route::get('{id}', [GroupController::class, 'show']);
    
    // 创建群组
    Route::post('/', [GroupController::class, 'store']);
    
    // 更新群组
    Route::put('{id}', [GroupController::class, 'update']);
    
    // 删除群组
    Route::delete('{id}', [GroupController::class, 'destroy']);
    
    // 加入群组
    Route::post('{id}/join', [GroupController::class, 'join']);
    
    // 退出群组
    Route::post('{id}/leave', [GroupController::class, 'leave']);
    
    // 获取群组成员
    Route::get('{id}/members', [GroupController::class, 'members']);
    
    // 移除成员
    Route::delete('{id}/members/{userId}', [GroupController::class, 'removeMember']);
    
    // 设置成员角色
    Route::put('{id}/members/{userId}/role', [GroupController::class, 'setMemberRole']);
});

// 帖子相关路由
Route::prefix('posts')->middleware('auth:sanctum')->group(function () {
    // 发布帖子
    Route::post('/', [PostController::class, 'store']);
    
    // 获取帖子列表
    Route::get('/', [PostController::class, 'index']);
    
    // 获取帖子详情
    Route::get('{id}', [PostController::class, 'show']);
    
    // 删除帖子
    Route::delete('{id}', [PostController::class, 'destroy']);
    
    // 点赞/取消点赞帖子
    Route::post('{id}/like', [PostController::class, 'like']);
    
    // 发布评论
    Route::post('{id}/comments', [PostController::class, 'comment']);
    
    // 删除评论
    Route::delete('{postId}/comments/{commentId}', [PostController::class, 'deleteComment']);
    
    // 点赞/取消点赞评论
    Route::post('{postId}/comments/{commentId}/like', [PostController::class, 'likeComment']);
    
    // 举报帖子
    Route::post('{id}/report', [PostController::class, 'report']);
    
    // 置顶/取消置顶
    Route::post('{id}/pin', [PostController::class, 'pin']);
});

// 用户资料相关路由
Route::prefix('profile')->middleware('auth:sanctum')->group(function () {
    // 获取当前用户资料
    Route::get('/', [ProfileController::class, 'show']);
    
    // 更新用户资料
    Route::put('/', [ProfileController::class, 'update']);
    
    // 上传头像
    Route::post('/avatar', [ProfileController::class, 'uploadAvatar']);
    
    // 获取当前用户发布的帖子 (must be before /{userId}/posts)
    Route::get('/posts', [ProfileController::class, 'posts']);
    
    // 获取当前用户加入的群组 (must be before /{userId}/groups)
    Route::get('/groups', [ProfileController::class, 'groups']);
    
    // 更新邮箱
    Route::put('/email', [ProfileController::class, 'updateEmail']);
    
    // 更新手机号
    Route::put('/phone', [ProfileController::class, 'updatePhone']);
    
    // 修改密码
    Route::put('/password', [ProfileController::class, 'changePassword']);
    
    // 获取指定用户资料
    Route::get('/{userId}', [ProfileController::class, 'show']);
    
    // 获取用户发布的帖子
    Route::get('/{userId}/posts', [ProfileController::class, 'posts']);
    
    // 获取用户加入的群组
    Route::get('/{userId}/groups', [ProfileController::class, 'groups']);
});

// 关注相关路由
Route::prefix('follow')->middleware('auth:sanctum')->group(function () {
    // 关注用户
    Route::post('/{userId}', [FollowController::class, 'follow']);
    
    // 取消关注
    Route::delete('/{userId}', [FollowController::class, 'unfollow']);
    
    // 获取关注列表
    Route::get('/following/{userId?}', [FollowController::class, 'following']);
    
    // 获取粉丝列表
    Route::get('/followers/{userId?}', [FollowController::class, 'followers']);
    
    // 检查关注状态
    Route::get('/status/{userId}', [FollowController::class, 'checkFollowStatus']);
});

// 通知相关路由
Route::prefix('notifications')->middleware('auth:sanctum')->group(function () {
    // 获取通知列表
    Route::get('/', [NotificationController::class, 'index']);
    
    // 获取未读数量
    Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    
    // 标记为已读
    Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
    
    // 标记全部为已读
    Route::put('/read-all', [NotificationController::class, 'markAllAsRead']);
    
    // 删除通知
    Route::delete('/{id}', [NotificationController::class, 'destroy']);
    
    // 清空已读通知
    Route::delete('/clear-read', [NotificationController::class, 'clearRead']);
});

// 受保护的路由
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});