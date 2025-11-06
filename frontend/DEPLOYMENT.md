# 🚀 Campus Connect - 阿里云部署指南

## 部署架构

```
用户请求
    ↓
阿里云 SLB (负载均衡)
    ↓
Nginx (反向代理 + 静态文件服务)
    ↓
Next.js 应用 (PM2管理)
    ↓
Laravel API (后端)
    ↓
PostgreSQL + Redis
```

## 📋 前置要求

### 服务器配置建议
- **CPU**: 2核及以上
- **内存**: 4GB及以上
- **硬盘**: 40GB SSD
- **系统**: Ubuntu 20.04 LTS 或 CentOS 8

### 需要安装的软件
- Node.js 18.x
- PM2
- Nginx
- Git

## 🔧 服务器环境准备

### 1. 安装 Node.js 18
```bash
# 使用 NVM 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
node --version  # 应该显示 v18.x.x
```

### 2. 安装 PM2
```bash
npm install -g pm2
pm2 --version
```

### 3. 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx -y

# CentOS
sudo yum install nginx -y

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 📦 部署步骤

### Step 1: 克隆代码
```bash
cd /var/www
sudo git clone <your-repo-url> campus-connect
cd campus-connect/frontend
sudo chown -R $USER:$USER /var/www/campus-connect
```

### Step 2: 安装依赖
```bash
npm install --production
```

### Step 3: 配置环境变量
```bash
cp .env.local.example .env.local
nano .env.local
```

编辑内容：
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_NAME=Campus Connect
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Step 4: 构建生产版本
```bash
npm run build
```

### Step 5: 使用 PM2 启动
```bash
# 启动应用
pm2 start npm --name "campus-connect-web" -- start

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs campus-connect-web
```

### Step 6: 配置 Nginx

创建配置文件:
```bash
sudo nano /etc/nginx/sites-available/campus-connect
```

写入以下内容:
```nginx
# HTTP - 重定向到 HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 证书配置 (使用阿里云SSL或Let's Encrypt)
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 日志
    access_log /var/log/nginx/campus-connect-access.log;
    error_log /var/log/nginx/campus-connect-error.log;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # 反向代理到 Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Next.js 静态文件缓存
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # 图片等静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

启用配置:
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/campus-connect /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### Step 7: 配置 SSL 证书

#### 选项 A: 使用阿里云 SSL 证书
1. 在阿里云控制台申请免费SSL证书
2. 下载证书文件（Nginx格式）
3. 上传到服务器 `/etc/ssl/campus-connect/`
4. 更新Nginx配置中的证书路径

#### 选项 B: 使用 Let's Encrypt (免费)
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 自动配置 SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

## 🔄 更新部署流程

### 方式1: 手动更新
```bash
cd /var/www/campus-connect/frontend
git pull origin main
npm install
npm run build
pm2 restart campus-connect-web
```

### 方式2: 使用部署脚本
创建 `deploy.sh`:
```bash
#!/bin/bash
echo "🚀 开始部署..."

cd /var/www/campus-connect/frontend

echo "📥 拉取最新代码..."
git pull origin main

echo "📦 安装依赖..."
npm install --production

echo "🔨 构建项目..."
npm run build

echo "🔄 重启服务..."
pm2 restart campus-connect-web

echo "✅ 部署完成！"
pm2 status
```

使用方法:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 📊 监控与日志

### PM2 监控
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs campus-connect-web

# 查看详细监控
pm2 monit

# 查看进程信息
pm2 info campus-connect-web
```

### Nginx 日志
```bash
# 访问日志
sudo tail -f /var/log/nginx/campus-connect-access.log

# 错误日志
sudo tail -f /var/log/nginx/campus-connect-error.log
```

### 配置日志轮转
```bash
sudo nano /etc/logrotate.d/campus-connect
```

内容:
```
/var/log/nginx/campus-connect-*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

## 🔒 安全加固

### 1. 配置防火墙
```bash
# 只开放必要端口
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

### 2. 配置 fail2ban (防止暴力破解)
```bash
sudo apt install fail2ban -y
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 3. 定期更新系统
```bash
sudo apt update && sudo apt upgrade -y
```

## 🎯 性能优化

### 1. 配置 Node.js 集群模式
修改 PM2 配置:
```bash
pm2 start npm --name "campus-connect-web" -i max -- start
```

### 2. 开启 Nginx 缓存
在 Nginx 配置中添加:
```nginx
# 在 http 块中
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=nextjs_cache:10m max_size=1g inactive=60m;

# 在 server 块中
location / {
    proxy_cache nextjs_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    # ... 其他配置
}
```

### 3. 配置 CDN (阿里云 CDN)
1. 在阿里云控制台配置CDN
2. 将静态资源路径指向CDN
3. 更新 `next.config.js`:
```javascript
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com' 
    : '',
}
```

## 🐛 常见问题

### Q1: PM2 启动失败
```bash
# 检查端口占用
sudo lsof -i :3000

# 查看错误日志
pm2 logs campus-connect-web --err

# 清除PM2缓存
pm2 delete all
pm2 kill
pm2 start npm --name "campus-connect-web" -- start
```

### Q2: Nginx 502 Bad Gateway
```bash
# 检查 Next.js 是否运行
pm2 status

# 检查防火墙
sudo ufw status

# 检查 SELinux (CentOS)
sudo setenforce 0
```

### Q3: SSL 证书错误
```bash
# 测试证书
sudo nginx -t

# 检查证书有效期
openssl x509 -in /path/to/certificate.crt -noout -dates

# 续期 Let's Encrypt
sudo certbot renew
```

## 📱 阿里云特定配置

### 1. 安全组设置
在阿里云控制台配置安全组规则:
- 入方向: 允许 80, 443, 22 端口
- 出方向: 允许所有

### 2. SLB 负载均衡 (可选)
如果需要高可用:
1. 创建多台ECS实例
2. 配置SLB指向各实例
3. 配置健康检查

### 3. OSS 图片存储
```bash
# 安装 aliyun-sdk
npm install ali-oss
```

## 🎉 验证部署

### 检查清单
- [ ] 网站可以通过域名访问
- [ ] HTTPS 正常工作（绿锁）
- [ ] 页面加载速度快（< 3秒）
- [ ] 移动端显示正常
- [ ] 深色模式切换正常
- [ ] 登录功能正常
- [ ] API 调用正常
- [ ] 静态资源加载正常

### 性能测试
```bash
# 使用 Apache Bench
ab -n 1000 -c 100 https://yourdomain.com/

# 使用 Lighthouse (Chrome DevTools)
lighthouse https://yourdomain.com/ --view
```

## 📞 支持

遇到问题？
1. 检查日志: `pm2 logs` 和 `/var/log/nginx/`
2. 查看文档: `README.md` 和 `QUICKSTART.md`
3. 联系开发团队

---

**部署完成后，记得:**
- ✅ 配置监控告警
- ✅ 设置定期备份
- ✅ 配置 CDN 加速
- ✅ 进行压力测试

祝部署顺利！🎉
