#!/bin/bash

echo "=== 完成Laravel项目设置 ==="
echo ""

# 设置PHP路径
export PATH="/opt/homebrew/opt/php@8.1/bin:$PATH"

# 创建必要的目录
mkdir -p storage/framework/{cache,sessions,views}
mkdir -p storage/app/public

# 设置权限
chmod -R 775 storage
chmod -R 775 bootstrap/cache

echo "✅ 目录权限设置完成"
echo ""

echo "🎉 安装完成！"
echo ""
echo "下一步："
echo "1. 确保 PostgreSQL 和 Redis 服务已启动"
echo "2. 修改 .env 文件中的数据库配置"
echo "3. 运行: export PATH="/opt/homebrew/opt/php@8.1/bin:\$PATH" && php artisan serve"
echo "4. 访问: http://localhost:8000"
echo ""
echo "注意：由于 artisan 命令存在问题，您可能需要手动运行数据库迁移"
echo "数据库迁移命令："
echo "export PATH="/opt/homebrew/opt/php@8.1/bin:\$PATH" && php artisan migrate"
