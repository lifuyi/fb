# Campus Connect - Login Guide

## ⚠️ Important: About the "Method Not Allowed" Error

If you see this error:
```
The GET method is not supported for route api/auth/email-login. Supported methods: POST.
```

**This is correct behavior!** The login endpoint is designed to only accept POST requests for security reasons. You cannot access it directly via a browser URL (which uses GET).

## ✅ How to Login Properly

### Option 1: Use the Web Interface (Recommended)
1. Open your browser
2. Go to: http://localhost:3000/login
3. Enter credentials:
   - **Email:** alice@hit.edu.cn
   - **Password:** password123
4. Click "登录" button

### Option 2: Use API Testing Tools

#### Using cURL:
```bash
curl -X POST http://localhost:8000/api/auth/email-login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@hit.edu.cn","password":"password123"}'
```

#### Using Postman or Insomnia:
- Method: POST
- URL: http://localhost:8000/api/auth/email-login
- Headers: Content-Type: application/json
- Body (JSON):
  ```json
  {
    "email": "alice@hit.edu.cn",
    "password": "password123"
  }
  ```

## 🔐 Test Accounts

All passwords: `password123`

| Email | Name | University |
|-------|------|------------|
| alice@hit.edu.cn | Alice Wang | 哈尔滨工业大学 |
| bob@hrbeu.edu.cn | Bob Chen | 哈尔滨工程大学 |
| carol@nefu.edu.cn | Carol Liu | 东北林业大学 |
| david@hlju.edu.cn | David Zhang | 黑龙江大学 |
| emma@hrbmu.edu.cn | Emma Li | 哈尔滨医科大学 |

## 🚀 Quick Start

### 1. Start the Servers
```bash
# Terminal 1 - Backend
cd backend
php artisan serve
# Running on http://localhost:8000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Running on http://localhost:3000
```

### 2. Access the Application
Open your browser and navigate to:
- **Login Page:** http://localhost:3000/login
- **Main App:** http://localhost:3000

### 3. Login
- Choose "邮箱登录" (Email Login) or "手机登录" (Phone Login)
- For email login, use any test account above
- For phone login, use the "发送验证码" button (mock implementation)

## 📱 Features After Login

Once logged in, you can:
1. **View Feed** - See posts from all groups
2. **View Profile** - Go to /profile or click your avatar
3. **Edit Profile** - Update your information
4. **Follow Users** - Visit other profiles (/profile/2, /profile/3, etc.)
5. **Notifications** - Click the bell icon to see updates
6. **Join Groups** - Browse and participate in groups
7. **Create Posts** - Share content in groups

## 🔧 Troubleshooting

### Error: "Method Not Allowed"
- **Cause:** Trying to access POST endpoints with GET (browser URL)
- **Solution:** Use the web interface at http://localhost:3000/login

### Error: "Connection Refused"
- **Cause:** Backend server not running
- **Solution:** Run `cd backend && php artisan serve`

### Error: "Cannot connect to API"
- **Cause:** Frontend can't reach backend
- **Solution:** 
  1. Check backend is running on port 8000
  2. Check frontend .env has correct API_URL
  3. Verify no firewall blocking

### Login Button Not Working
- **Cause:** Form validation or API error
- **Solution:**
  1. Check browser console for errors
  2. Verify email format is correct
  3. Check password is at least 6 characters

## 🎯 What to Do After Login

### First Time Users
1. **Complete Your Profile**
   - Click avatar → Edit Profile
   - Add bio, skills, university info
   - Upload an avatar

2. **Explore the Platform**
   - Browse groups
   - Read posts
   - Follow interesting users

3. **Start Engaging**
   - Create your first post
   - Comment on others' posts
   - Like content you enjoy

### Testing Social Features
1. Login as Alice (alice@hit.edu.cn)
2. View Bob's profile (/profile/2)
3. Click "关注" to follow Bob
4. Login as Bob (bob@hrbeu.edu.cn)
5. Click notification bell to see Alice followed you

## 📊 API Endpoints Reference

### Authentication (All POST except GET /api/auth/user)
```
POST /api/auth/email-login      - Email login
POST /api/auth/phone-login      - Phone login
POST /api/auth/email-register   - Email registration
POST /api/auth/phone-register   - Phone registration
POST /api/auth/logout           - Logout
GET  /api/auth/user             - Get current user
```

### Profile (Requires Authentication)
```
GET  /api/profile               - Get current user profile
GET  /api/profile/{userId}      - Get specific user profile
PUT  /api/profile               - Update profile
POST /api/profile/avatar        - Upload avatar
```

### Follow (Requires Authentication)
```
POST   /api/follow/{userId}     - Follow user
DELETE /api/follow/{userId}     - Unfollow user
GET    /api/follow/following    - Get following list
GET    /api/follow/followers    - Get followers list
```

### Notifications (Requires Authentication)
```
GET    /api/notifications       - Get notifications
GET    /api/notifications/unread-count - Get unread count
PUT    /api/notifications/{id}/read - Mark as read
```

## 💡 Tips

1. **Use the Web Interface** - It's the easiest way to use the application
2. **Browser Developer Tools** - Press F12 to see network requests and errors
3. **Check Both Servers** - Make sure both backend and frontend are running
4. **Clear Browser Cache** - If things look broken, try Ctrl+Shift+R
5. **Test with Multiple Accounts** - Login with different users to test social features

## 🎉 Everything is Working!

If you successfully logged in through the web interface, your application is working correctly. The "Method Not Allowed" error you saw was just from trying to access a POST endpoint with GET, which is the expected security behavior.

Happy exploring Campus Connect! 🚀
