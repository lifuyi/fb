#!/bin/bash

echo "=== Campus Connect Backend 启动脚本 ==="
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 检查.env文件
if [ ! -f .env ]; then
    echo "❌ .env 文件不存在，请先运行 install.sh"
    exit 1
fi

# 启动服务
echo "🚀 启动 Laravel 服务..."
echo "访问地址: http://localhost:8000"
echo "按 Ctrl+C 停止服务"
echo ""

/opt/homebrew/opt/php@8.1/bin/php artisan serve --host=0.0.0.0 --port=8000