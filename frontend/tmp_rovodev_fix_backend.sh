#!/bin/bash

# This script fixes the backend authentication configuration issue

echo "🔧 Fixing backend authentication configuration..."

# Create auth.php config file
cat > ../backend/config/auth.php << 'EOF'
<?php

return [
    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        'api' => [
            'driver' => 'sanctum',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];
EOF

echo "✅ Created auth.php configuration file"

# Add registration routes to api.php
echo ""
echo "📝 Adding registration endpoints to API routes..."

# Backup original api.php
cp ../backend/routes/api.php ../backend/routes/api.php.backup

# Add registration routes after the auth prefix line
sed -i.bak '/Route::prefix('"'auth'"')/a\
    // 邮箱注册\
    Route::post('"'email-register'"', [AuthController::class, '"'emailRegister'"']);\
    \
    // 手机号注册\
    Route::post('"'phone-register'"', [AuthController::class, '"'phoneRegister'"']);\
' ../backend/routes/api.php

echo "✅ Added registration routes"

# Add registration methods to AuthController
echo ""
echo "📝 Adding registration methods to AuthController..."

# Create a temporary file with the registration methods
cat > /tmp/registration_methods.php << 'EOFPHP'

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
EOFPHP

echo "✅ Registration methods prepared"
echo ""
echo "⚠️  MANUAL STEP REQUIRED:"
echo "Please add the registration methods from /tmp/registration_methods.php"
echo "to ../backend/app/Http/Controllers/AuthController.php"
echo "Add them before the closing brace of the class."
echo ""
echo "🔄 Restart the backend server after making changes:"
echo "   cd ../backend && php artisan serve"
