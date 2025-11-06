#!/bin/bash

echo "=== Campus Connect Backend 安装脚本 ==="
echo ""

# 检查PHP是否已安装
if ! command -v php &> /dev/null; then
    echo "❌ PHP 未安装"
    echo "请先安装 PHP 8.1+:"
    echo "macOS: brew install php@8.1"
    echo "Ubuntu: sudo apt-get install php8.1 php8.1-pgsql php8.1-redis"
    echo "CentOS: sudo yum install php81 php81-pgsql php81-phpredis"
    echo ""
    exit 1
fi

echo "✅ PHP 已安装: $(php --version)"
echo ""

# 检查Composer是否已安装
if ! command -v composer &> /dev/null; then
    echo "⬇️ 正在安装 Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    echo "✅ Composer 安装完成"
else
    echo "✅ Composer 已安装: $(composer --version)"
fi
echo ""

# 进入项目目录
cd "$(dirname "$0")"
echo "📁 当前目录: $(pwd)"
echo ""

# 安装依赖
echo "⬇️ 正在安装项目依赖..."
composer install --no-dev --optimize-autoloader
echo "✅ 依赖安装完成"
echo ""

# 复制环境配置文件
if [ ! -f .env ]; then
    echo "📝 创建环境配置文件..."
    cp .env.example .env
    echo "✅ .env 文件已创建，请修改以下配置："
    echo "   - DB_CONNECTION=pgsql"
    echo "   - DB_HOST=127.0.0.1"
    echo "   - DB_PORT=5432"
    echo "   - DB_DATABASE=campus_connect"
    echo "   - DB_USERNAME=postgres"
    echo "   - DB_PASSWORD=your_password"
    echo "   - REDIS_HOST=127.0.0.1"
    echo "   - REDIS_PORT=6379"
    echo ""
fi

# 生成应用密钥
echo "🔑 生成应用密钥..."
php artisan key:generate
echo ""

# 运行数据库迁移
echo "⚙️ 运行数据库迁移..."
php artisan migrate
echo ""

# 填充大学数据
echo "📚 填充大学数据..."
php artisan db:seed --class=UniversitySeeder
echo ""

# 创建存储链接
echo "🔗 创建存储链接..."
php artisan storage:link
echo ""

# 清理缓存
echo "🧹 清理缓存..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo ""

echo "🎉 安装完成！"
echo ""
echo "下一步："
echo "1. 确保 PostgreSQL 和 Redis 服务已启动"
echo "2. 修改 .env 文件中的数据库配置"
echo "3. 运行: php artisan serve"
echo "4. 访问: http://localhost:8000"
echo ""
echo "API文档地址: http://localhost:8000/api/documentation"