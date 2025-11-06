# Campus Connect Backend API

## 项目说明
校园社交平台后端API，基于Laravel 10开发。

## 技术栈
- PHP 8.1+
- Laravel 10
- PostgreSQL 14+
- Redis 6+
- Laravel Sanctum (API认证)

## 安装步骤

### 1. 环境要求
- PHP 8.1+
- Composer 2.0+
- PostgreSQL 14+
- Redis 6+

### 2. 安装依赖
```bash
composer install
```

### 3. 环境配置
```bash
cp .env.example .env
php artisan key:generate
```

### 4. 配置数据库
修改 `.env` 文件中的数据库配置：
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=campus_connect
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 5. 运行迁移
```bash
php artisan migrate
```

### 6. 填充基础数据
```bash
php artisan db:seed --class=UniversitySeeder
```

### 7. 启动服务
```bash
php artisan serve
```

## API文档

### 认证相关

#### 微信登录
```
POST /api/v1/auth/wechat-login
Content-Type: application/json

{
    "code": "微信授权码",
    "nickname": "用户昵称",
    "avatar_url": "头像URL"
}
```

#### 手机号登录
```
POST /api/v1/auth/phone-login
Content-Type: application/json

{
    "phone": "13800138000",
    "code": "123456"
}
```

#### 邮箱登录
```
POST /api/v1/auth/email-login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

#### 发送短信验证码
```
POST /api/v1/auth/send-sms-code
Content-Type: application/json

{
    "phone": "13800138000"
}
```

#### 获取用户信息
```
GET /api/v1/auth/user
Authorization: Bearer {token}
```

#### 更新用户资料
```
PUT /api/v1/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
    "nickname": "新昵称",
    "bio": "个人简介",
    "gender": 1,
    "birth_year": 2000,
    "university_id": 1,
    "major": "计算机科学与技术",
    "graduation_year": 2024,
    "skills": ["编程", "设计"]
}
```

## 响应格式

### 成功响应
```json
{
    "code": 200,
    "message": "success",
    "data": {},
    "timestamp": 1234567890
}
```

### 错误响应
```json
{
    "code": 400,
    "message": "错误信息",
    "data": {},
    "timestamp": 1234567890
}
```

### 分页响应
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "list": [],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 100,
            "pages": 5
        }
    },
    "timestamp": 1234567890
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 422 | 验证失败 |
| 500 | 服务器错误 |

## 开发规范

### 1. 代码规范
- 遵循PSR-12编码标准
- 使用Laravel内置的代码风格
- 所有API返回统一的JSON格式

### 2. 数据库规范
- 表名使用复数形式
- 字段名使用蛇形命名法
- 主键统一使用id
- 外键使用表名_id格式

### 3. API规范
- 使用RESTful风格
- 路由使用复数形式
- HTTP状态码语义正确
- 统一的错误处理

## 部署说明

### 1. 服务器配置
- CPU: 2核
- 内存: 4GB
- 硬盘: 50GB SSD
- 带宽: 5Mbps

### 2. 环境变量
生产环境需要配置以下变量：
```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=pgsql
REDIS_HOST=redis-server
```

### 3. 性能优化
- 开启OPcache
- 使用Redis缓存
- 配置CDN
- 数据库查询优化

## 测试

### 运行测试
```bash
php artisan test
```

### 生成测试覆盖率报告
```bash
php artisan test --coverage
```

## 常见问题

### 1. 微信登录
需要配置微信小程序的AppID和Secret。

### 2. 短信发送
需要配置短信服务商的API密钥。

### 3. 文件上传
需要配置阿里云OSS的访问密钥。

## 许可证
MIT License