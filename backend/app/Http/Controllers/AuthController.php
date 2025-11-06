<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // 微信登录
    public function wechatLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
            'nickname' => 'nullable|string|max:50',
            'avatar_url' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        // TODO: 调用微信API获取openid
        // $wechatUser = $this->getWechatUser($request->code);
        // $openid = $wechatUser['openid'];

        // 临时模拟
        $openid = 'mock_openid_' . Str::random(20);

        $user = User::where('wechat_openid', $openid)->first();

        if (!$user) {
            // 创建新用户
            $user = User::create([
                'wechat_openid' => $openid,
                'status' => 0, // 未验证
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ]);

            // 创建用户资料
            UserProfile::create([
                'user_id' => $user->id,
                'nickname' => $request->nickname ?? '微信用户',
                'avatar_url' => $request->avatar_url,
            ]);
        } else {
            // 更新登录信息
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ]);
        }

        // 创建token
        $token = $user->createToken('api')->plainTextToken;

        return $this->success([
            'user' => $user->load('profile.university'),
            'token' => $token,
        ], '登录成功');
    }

    // 手机号登录
    public function phoneLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|regex:/^1[3-9]\d{9}$/',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        // TODO: 验证短信验证码
        // if (!$this->verifySmsCode($request->phone, $request->code)) {
        //     return $this->error('验证码错误');
        // }

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            // 创建新用户
            $user = User::create([
                'phone' => $request->phone,
                'status' => 0,
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ]);

            UserProfile::create([
                'user_id' => $user->id,
                'nickname' => substr($request->phone, -4),
            ]);
        } else {
            $user->update([
                'last_login_at' => now(),
                'last_login_ip' => $request->ip(),
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return $this->success([
            'user' => $user->load('profile.university'),
            'token' => $token,
        ], '登录成功');
    }

    // 邮箱登录
    public function emailLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:128',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return $this->error('邮箱或密码错误');
        }

        $user = Auth::user();
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return $this->success([
            'user' => $user->load('profile.university'),
            'token' => $token,
        ], '登录成功');
    }

    // 发送短信验证码
    public function sendSmsCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|regex:/^1[3-9]\d{9}$/',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        // TODO: 发送短信验证码
        // $code = random_int(100000, 999999);
        // Cache::put('sms:'.$request->phone, $code, 300);

        return $this->success([], '验证码已发送');
    }

    // 退出登录
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->success([], '退出成功');
    }

    // 刷新token
    public function refreshToken(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $token = $request->user()->createToken('api')->plainTextToken;

        return $this->success([
            'token' => $token,
        ], '刷新成功');
    }

    // 获取用户信息
    public function user(Request $request)
    {
        return $this->success($request->user()->load('profile.university'));
    }

    // 更新用户资料
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nickname' => 'nullable|string|max:50',
            'bio' => 'nullable|string|max:500',
            'gender' => 'nullable|integer|in:0,1,2',
            'birth_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'university_id' => 'nullable|exists:universities,id',
            'major' => 'nullable|string|max:100',
            'graduation_year' => 'nullable|integer|min:' . date('Y') . '|max:' . (date('Y') + 10),
            'skills' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        $profile = $request->user()->profile;
        $profile->update($request->only([
            'nickname', 'bio', 'gender', 'birth_year',
            'university_id', 'major', 'graduation_year', 'skills'
        ]));

        return $this->success($profile->load('university'), '更新成功');
    }

    // 邮箱注册
    public function emailRegister(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:128|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'nickname' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        // 创建用户
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => 0,
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // 创建用户资料
        UserProfile::create([
            'user_id' => $user->id,
            'nickname' => $request->nickname,
        ]);

        // 创建token
        $token = $user->createToken('api')->plainTextToken;

        return $this->success([
            'user' => $user->load('profile.university'),
            'token' => $token,
        ], '注册成功');
    }

    // 手机号注册
    public function phoneRegister(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string|regex:/^1[3-9]\d{9}$/|unique:users,phone',
            'code' => 'required|string|size:6',
            'nickname' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return $this->error('参数错误', 422, $validator->errors());
        }

        // TODO: 验证短信验证码
        // if (!$this->verifySmsCode($request->phone, $request->code)) {
        //     return $this->error('验证码错误');
        // }

        // 创建用户
        $user = User::create([
            'phone' => $request->phone,
            'status' => 0,
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        // 创建用户资料
        UserProfile::create([
            'user_id' => $user->id,
            'nickname' => $request->nickname,
        ]);

        // 创建token
        $token = $user->createToken('api')->plainTextToken;

        return $this->success([
            'user' => $user->load('profile.university'),
            'token' => $token,
        ], '注册成功');
    }
}
