# 后端 Phase 1 开发计划 - Campus Connect

## 项目概述
**目标**：实现后端核心功能，为前端提供API支持
**技术栈**：Laravel 10 + PostgreSQL + Redis + JWT + Sanctum
**开发周期**：4-6周

---

## 核心功能模块

### 1. 用户管理模块 (Week 1-2)

#### 1.1 用户注册与登录
**功能**：
- 微信OAuth登录（主要方式）
- 手机号验证码登录
- 邮箱验证登录
- JWT Token认证

**API接口**：
```http
POST /api/v1/auth/wechat-login
POST /api/v1/auth/phone-login  
POST /api/v1/auth/email-login
POST /api/v1/auth/refresh-token
POST /api/v1/auth/logout
```

**数据库表**：
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    wechat_openid VARCHAR(128) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(128) UNIQUE,
    password_hash VARCHAR(255),
    status INTEGER DEFAULT 0, -- 0:未验证 1:已验证 2:已禁用
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id),
    nickname VARCHAR(50),
    avatar_url VARCHAR(500),
    bio TEXT,
    gender INTEGER, -- 0:未知 1:男 2:女
    birth_year INTEGER,
    university_id BIGINT,
    major VARCHAR(100),
    graduation_year INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE universities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    domain VARCHAR(50) UNIQUE, -- .edu.cn
    province VARCHAR(20),
    city VARCHAR(20),
    status INTEGER DEFAULT 1
);
```

#### 1.2 用户认证与验证
**功能**：
- 学生证上传与人工审核
- 邮箱验证（.edu.cn域名）
- 实名认证（可选）

**API接口**：
```http
POST /api/v1/user/upload-student-id
GET /api/v1/user/verification-status
POST /api/v1/user/send-email-verify
POST /api/v1/user/verify-email
```

**数据库表**：
```sql
CREATE TABLE user_verifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    type INTEGER, -- 1:学生证 2:邮箱 3:实名
    status INTEGER DEFAULT 0, -- 0:待审核 1:已通过 2:已拒绝
    data JSONB, -- 存储验证相关数据
    reviewed_by BIGINT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. 社区模块 (Week 3-4)

#### 2.1 群组管理
**功能**：
- 创建群组（公开/私有）
- 加入/退出群组
- 群组成员管理
- 群组权限控制

**API接口**：
```http
POST /api/v1/groups
GET /api/v1/groups
GET /api/v1/groups/{id}
PUT /api/v1/groups/{id}
DELETE /api/v1/groups/{id}
POST /api/v1/groups/{id}/join
DELETE /api/v1/groups/{id}/leave
GET /api/v1/groups/{id}/members
PUT /api/v1/groups/{id}/members/{userId}
DELETE /api/v1/groups/{id}/members/{userId}
```

**数据库表**：
```sql
CREATE TABLE groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),
    type INTEGER DEFAULT 0, -- 0:公开 1:私有 2:官方
    owner_id BIGINT REFERENCES users(id),
    university_id BIGINT,
    member_count INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE group_members (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT REFERENCES groups(id),
    user_id BIGINT REFERENCES users(id),
    role INTEGER DEFAULT 0, -- 0:成员 1:管理员 2:群主
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);
```

#### 2.2 帖子与动态
**功能**：
- 发布帖子（文字/图片）
- 帖子列表与分页
- 点赞/取消点赞
- 评论与回复
- 帖子举报

**API接口**：
```http
POST /api/v1/posts
GET /api/v1/posts
GET /api/v1/posts/{id}
PUT /api/v1/posts/{id}
DELETE /api/v1/posts/{id}
POST /api/v1/posts/{id}/like
DELETE /api/v1/posts/{id}/like
GET /api/v1/posts/{id}/comments
POST /api/v1/posts/{id}/comments
POST /api/v1/posts/{id}/report
```

**数据库表**：
```sql
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    group_id BIGINT REFERENCES groups(id),
    user_id BIGINT REFERENCES users(id),
    content TEXT,
    type INTEGER DEFAULT 0, -- 0:文字 1:图片 2:链接
    images JSONB, -- 图片URL数组
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1, -- 1:正常 0:已删除
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES posts(id),
    user_id BIGINT REFERENCES users(id),
    parent_id BIGINT REFERENCES comments(id), -- 回复评论
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    target_type INTEGER, -- 1:帖子 2:评论
    target_id BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, target_type, target_id)
);
```

### 3. 管理后台模块 (Week 5)

#### 3.1 用户管理
**功能**：
- 用户列表查询
- 用户详情查看
- 用户禁用/启用
- 学生证审核

**API接口**：
```http
GET /api/v1/admin/users
GET /api/v1/admin/users/{id}
PUT /api/v1/admin/users/{id}/status
GET /api/v1/admin/verifications
PUT /api/v1/admin/verifications/{id}/review
```

#### 3.2 内容管理
**功能**：
- 帖子举报处理
- 群组管理
- 敏感词过滤

**API接口**：
```http
GET /api/v1/admin/reports
PUT /api/v1/admin/reports/{id}/handle
GET /api/v1/admin/groups
PUT /api/v1/admin/groups/{id}/status
```

**数据库表**：
```sql
CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_id BIGINT REFERENCES users(id),
    target_type INTEGER, -- 1:帖子 2:评论 3:用户
    target_id BIGINT,
    reason INTEGER, -- 1:垃圾信息 2:违法内容 3:人身攻击
    description TEXT,
    status INTEGER DEFAULT 0, -- 0:待处理 1:已处理 2:已忽略
    handled_by BIGINT,
    handled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 技术实现细节

### 1. 认证与授权
```php
// config/sanctum.php
'expiration' => 15 * 60, // 15分钟
'refresh_expiration' => 30 * 24 * 60 * 60, // 30天

// 权限控制
// 使用Laravel Gates和Policies
Gate::define('admin', function ($user) {
    return $user->role === 'admin';
});

// 中间件
Route::middleware('auth:sanctum')->group(function () {
    // 需要认证的路由
});

Route::middleware('auth:sanctum')->can('admin')->group(function () {
    // 管理员路由
});
```

### 2. 数据库优化
```sql
-- 索引优化
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_wechat ON users(wechat_openid);
CREATE INDEX idx_posts_group ON posts(group_id, created_at);
CREATE INDEX idx_posts_user ON posts(user_id, created_at);
CREATE INDEX idx_comments_post ON comments(post_id, created_at);
```

### 3. Redis缓存策略
```php
// 使用Laravel Cache
Cache::put('user:info:'.$userId, $userInfo, 30 * 60); // 30分钟
Cache::put('user:perms:'.$userId, $permissions, 15 * 60); // 15分钟
Cache::put('group:members:'.$groupId, $members, 10 * 60); // 10分钟
Cache::put('posts:hot:'.$groupId, $posts, 5 * 60); // 5分钟

// 模型缓存
class User extends Model {
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
    
    protected $cacheKeys = [
        'profile' => 'user:profile:{id}',
        'permissions' => 'user:perms:{id}'
    ];
}
```

### 4. 文件上传
```php
// app/Services/FileUploadService.php
class FileUploadService {
    public function uploadImage($file) {
        // 图片大小限制：5MB
        // 支持格式：jpg, png, gif
        // 自动压缩：宽度最大1080px
        // 使用Laravel Storage + 阿里云OSS
    }
}

// config/filesystems.php
'oss' => [
    'driver' => 'oss',
    'access_key' => env('OSS_ACCESS_KEY'),
    'secret_key' => env('OSS_SECRET_KEY'),
    'endpoint' => env('OSS_ENDPOINT'),
    'bucket' => env('OSS_BUCKET'),
],
```

---

## 开发计划

### Week 1: 基础架构
- [ ] Laravel项目初始化
- [ ] 数据库Migration创建
- [ ] Redis配置
- [ ] Sanctum认证实现
- [ ] 用户注册登录API

### Week 2: 用户管理
- [ ] 用户资料管理
- [ ] 学生证上传与审核
- [ ] 邮箱验证功能
- [ ] 权限控制完善

### Week 3: 社区功能 - 群组
- [ ] 群组CRUD接口
- [ ] 成员管理功能
- [ ] 权限控制实现
- [ ] 群组列表与搜索

### Week 4: 社区功能 - 帖子
- [ ] 帖子发布与展示
- [ ] 评论系统实现
- [ ] 点赞功能
- [ ] 举报系统

### Week 5: 管理后台
- [ ] 管理员权限系统
- [ ] 用户管理接口
- [ ] 内容审核功能
- [ ] 数据统计接口

### Week 6: 测试与优化
- [ ] PHPUnit单元测试编写
- [ ] API接口测试（Postman/Pest）
- [ ] 性能优化（查询优化、缓存）
- [ ] API文档生成（Scribe）

---

## API文档规范

### 请求格式
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1234567890
}
```

### 错误码定义
```
200: 成功
400: 请求参数错误
401: 未认证
403: 权限不足
404: 资源不存在
500: 服务器错误
1001: 用户不存在
1002: 密码错误
1003: 账号已禁用
```

### 分页格式
```json
{
  "code": 200,
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "size": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

---

## 部署要求

### 服务器配置
- CPU: 2核
- 内存: 4GB
- 硬盘: 50GB SSD
- 带宽: 5Mbps

### 环境要求
- PHP 8.1+
- Composer 2.0+
- PostgreSQL 14+
- Redis 6+
- Nginx 1.18+

### 监控指标
- API响应时间 < 500ms
- 数据库查询时间 < 100ms
- 缓存命中率 > 80%
- 系统可用性 > 99.5%