# 部署指南

## 环境要求

- PHP 8.1+
- Composer 2.0+
- PostgreSQL 14+
- Redis 6+

## 快速部署

### 1. 安装依赖

```bash
# macOS
brew install php@8.1 postgresql@14 redis

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install php8.1 php8.1-pgsql php8.1-redis postgresql-14 redis-server

# CentOS/RHEL
sudo yum install php81 php81-pgsql php81-phpredis postgresql14-server redis
```

### 2. 数据库设置

```bash
# 启动PostgreSQL
brew services start postgresql@14  # macOS
sudo systemctl start postgresql   # Linux

# 创建数据库
sudo -u postgres createdb campus_connect

# 创建用户（可选）
sudo -u postgres psql
CREATE USER campus_connect WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE campus_connect TO campus_connect;
\q
```

### 3. Redis设置

```bash
# 启动Redis
brew services start redis  # macOS
sudo systemctl start redis # Linux
```

### 4. 项目部署

```bash
# 克隆项目
git clone https://github.com/lifuyi/fb.git
cd fb/backend

# 运行安装脚本
./install.sh

# 或手动安装
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=UniversitySeeder
php artisan storage:link
```

### 5. 配置环境变量

编辑 `.env` 文件：

```env
# 数据库配置
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=campus_connect
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Redis配置
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 6. 启动服务

```bash
# 开发环境
./start.sh

# 或直接运行
php artisan serve --host=0.0.0.0 --port=8000
```

## 生产环境部署

### 1. 优化配置

```bash
# 优化自动加载
composer install --no-dev --optimize-autoloader

# 缓存配置
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. 任务调度

```bash
# 添加到crontab
* * * * * cd /path/to/your/project && php artisan schedule:run >> /dev/null 2>&1
```

### 3. 队列处理

```bash
# 启动队列工作进程
php artisan queue:work --daemon
```

### 4. Nginx配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/project/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## 常见问题

### 1. 数据库连接失败

- 检查PostgreSQL服务是否启动
- 验证数据库用户名和密码
- 确认数据库已创建

### 2. Redis连接失败

- 检查Redis服务是否启动
- 验证Redis端口配置

### 3. 权限问题

```bash
# 设置存储目录权限
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 4. Composer安装失败

```bash
# 更新Composer
composer self-update

# 清理缓存
composer clear-cache

# 使用国内镜像
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
```

## API测试

使用Postman或curl测试API：

```bash
# 获取群组列表
curl -X GET http://localhost:8000/api/v1/groups \
  -H "Authorization: Bearer YOUR_TOKEN"

# 发布帖子
curl -X POST http://localhost:8000/api/v1/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"group_id":1,"content":"Hello World!"}'
```

## 监控

### 1. 日志查看

```bash
# Laravel日志
tail -f storage/logs/laravel.log

# Nginx日志
tail -f /var/log/nginx/access.log
```

### 2. 性能监控

- 使用Laravel Telescope进行调试
- 配置APM工具（如New Relic、DataDog）
- 监控数据库和Redis性能