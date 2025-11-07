# Profile API Documentation

This document describes the profile-related API endpoints that have been implemented.

## Overview

The Profile API provides comprehensive functionality for managing user profiles, including:
- View and update user profile information
- Upload avatar images
- View user's posts and groups
- Update account security settings (email, phone, password)

## Authentication

All profile endpoints require authentication using Laravel Sanctum. Include the bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

## Endpoints

### 1. Get Current User Profile
- **Endpoint:** `GET /api/profile`
- **Description:** Get the authenticated user's profile with statistics
- **Response:** User object with profile, university, and statistics (posts_count, groups_count)

### 2. Get Specific User Profile
- **Endpoint:** `GET /api/profile/{userId}`
- **Parameters:** userId (path, required)
- **Description:** Get another user's profile by user ID

### 3. Update Profile
- **Endpoint:** `PUT /api/profile`
- **Body:** nickname, bio, gender, birth_year, university_id, major, graduation_year, skills
- **Description:** Update the authenticated user's profile information

### 4. Upload Avatar
- **Endpoint:** `POST /api/profile/avatar`
- **Body:** avatar (file, max 2MB, jpeg/png/jpg/gif)
- **Description:** Upload a new avatar image

### 5. Get User Posts
- **Endpoints:** 
  - `GET /api/profile/posts` - Current user's posts
  - `GET /api/profile/{userId}/posts` - Specific user's posts
- **Query Parameters:** page, size
- **Description:** Get paginated list of posts created by user

### 6. Get User Groups
- **Endpoints:**
  - `GET /api/profile/groups` - Current user's groups
  - `GET /api/profile/{userId}/groups` - Specific user's groups
- **Query Parameters:** page, size
- **Description:** Get paginated list of groups user has joined

### 7. Update Email
- **Endpoint:** `PUT /api/profile/email`
- **Body:** email, password
- **Description:** Update user's email address (requires password confirmation)

### 8. Update Phone
- **Endpoint:** `PUT /api/profile/phone`
- **Body:** phone, code
- **Description:** Update user's phone number (requires SMS verification code)

### 9. Change Password
- **Endpoint:** `PUT /api/profile/password`
- **Body:** old_password, new_password, new_password_confirmation
- **Description:** Change user's password

## Sample Data

The database has been seeded with:
- 5 test users with complete profiles
- 5 groups (tech, social, job categories)
- 12 sample posts with comments and likes
- 5 universities in Harbin

### Test Accounts

- **alice@hit.edu.cn** / password123 - Computer Science student
- **bob@hrbeu.edu.cn** / password123 - Software Engineer
- **carol@nefu.edu.cn** / password123 - UI/UX Designer
- **david@hlju.edu.cn** / password123 - Data Scientist
- **emma@hrbmu.edu.cn** / password123 - Medical Informatics student

## Testing

Run the test script:
```bash
bash backend/tmp_rovodev_test_profile_api.sh
```
