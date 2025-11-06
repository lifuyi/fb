# 🚀 Quick Start Guide - Campus Connect Web

## 快速启动指南

### 1️⃣ 安装依赖
```bash
cd frontend
npm install
```

### 2️⃣ 配置环境变量
`.env.local` 文件已创建，默认配置：
- API地址: http://localhost:8000/api
- 前端地址: http://localhost:3000

如需修改，编辑 `.env.local` 文件。

### 3️⃣ 启动后端服务
确保 Laravel 后端已启动：
```bash
cd ../backend
php artisan serve
```

### 4️⃣ 启动前端开发服务器
```bash
cd frontend
npm run dev
```

### 5️⃣ 访问应用
打开浏览器访问: http://localhost:3000

## 📱 测试账号

### 邮箱登录（需要先在后端创建测试用户）
```
邮箱: test@example.com
密码: password
```

### 手机登录
```
手机号: 13800138000
验证码: (需要后端发送短信)
```

## 🎨 主要页面

- **首页动态**: http://localhost:3000/feed
- **我的群组**: http://localhost:3000/groups
- **登录页面**: http://localhost:3000/login

## 🔧 开发工具

### 检查代码规范
```bash
npm run lint
```

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 💡 开发提示

### 1. 热重载
代码修改后会自动刷新浏览器，无需手动重启。

### 2. 主题切换
点击右上角的月亮/太阳图标可以切换亮色/暗色主题。

### 3. 响应式设计
- 桌面: 三栏布局 (左侧栏 + 主内容 + 右侧栏)
- 平板: 两栏布局 (主内容 + 右侧栏)
- 手机: 单栏布局 + 汉堡菜单

### 4. API调试
打开浏览器开发者工具 (F12) 查看网络请求：
- 所有API请求都发送到 `/api/*`
- 认证使用 Bearer Token
- 401错误会自动跳转到登录页

## 🐛 常见问题

### Q: 无法连接到后端API？
A: 检查：
1. 后端服务是否启动 (php artisan serve)
2. API地址是否正确 (.env.local 中的 NEXT_PUBLIC_API_URL)
3. CORS是否配置正确

### Q: 登录后显示401错误？
A: 检查：
1. Token是否正确保存到localStorage
2. 后端Sanctum配置是否正确
3. 清除浏览器缓存重试

### Q: 图片上传不工作？
A: Phase 1中图片上传功能尚未完成，需要集成阿里云OSS。

### Q: 微信登录按钮是灰色的？
A: 微信开放平台凭证尚未配置，等待申请完成。

## 📚 更多文档

- [完整README](./README.md)
- [组件文档](./components/)
- [API文档](./lib/services/)

## 🎯 下一步

1. ✅ 完成用户认证和基础功能测试
2. 🚧 集成微信SSO登录
3. 🚧 实现好友管理功能
4. 🚧 开发兼职市场模块
5. 🚧 开发房屋租赁模块
6. 🚧 开发餐厅点评模块

---

**需要帮助？** 联系开发团队 💬
