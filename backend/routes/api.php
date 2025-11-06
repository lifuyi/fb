<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// 认证相关路由
Route::prefix('auth')->group(function () {
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

// 受保护的路由
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});