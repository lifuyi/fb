# Phase 1 Requirements - Campus Connect MVP

## Project Overview
**Target**: University students in Heilongjiang Province, China
**Timeline**: 3 months (MVP)
**Platform**: WeChat Mini-Program + Web Admin

## Core Features (Phase 1)

### 1. User Authentication & Profiles (Month 1)
**Priority**: P0 - Critical

#### Registration & Login
- WeChat OAuth login (primary)
- Phone number verification (SMS)
- University email verification (.edu.cn)
- Student ID upload for manual verification
- Multi-device support (mini-program + web)

#### User Profile
- Basic info: nickname, avatar, bio, gender
- Academic: university, major, year, graduation date
- Skills tags (programming, design, etc.)
- Verification badges (email, student ID)
- Privacy controls

### 2. Groups & Community (Month 2)
**Priority**: P0 - Core Social Feature

#### Group Management
- Create groups (public, private)
- Join/leave groups
- Member roles (owner, admin, member)
- Group info & rules

#### Posts & Feed
- Text posts (max 2000 chars)
- Image posts (up to 9 images)
- Like/unlike posts
- Comments (nested replies)
- Share posts
- Report inappropriate content

### 3. Gig Marketplace (Month 2-3)
**Priority**: P0 - Revenue Feature

#### Gig Creation
- Service categories (tutoring, design, photography, etc.)
- Title, description, pricing (¥10-¥10,000)
- Portfolio images (up to 6)
- Delivery time settings

#### Gig Discovery
- Browse by category
- Search functionality
- Filters (price, rating, university)
- Sort options (relevance, price, newest)

#### Order Management
- Order placement with escrow
- Payment integration (WeChat Pay)
- Order status tracking
- Delivery & review system

### 4. Restaurant Reviews (Month 2)
**Priority**: P0 - Lifestyle Feature

#### Restaurant Database
- Pre-populated with 200+ restaurants per university
- Basic info: name, address, hours, price range
- Map integration (Baidu Maps)
- User-uploaded photos

#### Review System
- 5-star rating
- Written reviews (max 1000 chars)
- Photo uploads (up to 9)
- Tags: taste, environment, service, value

### 5. House Rentals (Month 3)
**Priority**: P0 - Essential Service

#### Rental Listings
- Property details: address, price, room type
- Amenities list
- Photo gallery (up to 12)
- Landlord verification

#### Search & Discovery
- Map view with pins
- List view with filters
- Search by area/neighborhood
- Filters: price, room type, distance

#### Contact System
- Inquiry form
- In-app messaging
- Safety features

### 6. Payment & Wallet (Month 2-3)
**Priority**: P0 - Transaction System

#### Payment Methods
- WeChat Pay (primary)
- Alipay (secondary)
- Platform wallet

#### Escrow System
- Hold payments until delivery
- Release funds upon completion
- Handle disputes & refunds

#### Commission
- 10% platform fee on completed orders
- Automatic deduction

### 7. Notifications (Month 3)
**Priority**: P1 - Engagement

#### Notification Types
- Transactional: orders, payments
- Social: likes, comments, follows
- System: updates, announcements

#### Delivery Channels
- In-app notifications
- WeChat template messages
- SMS for critical updates

### 8. Admin Dashboard (Month 1-3)
**Priority**: P1 - Operations

#### User Management
- View/search users
- Verify student IDs
- Ban/suspend users

#### Content Moderation
- Review reported content
- Approve/reject listings
- Keyword filtering

#### Analytics
- User metrics
- Transaction volume
- Revenue tracking

## Technical Requirements

### Backend
- Spring Boot 3.x (Java 17+)
- PostgreSQL + Redis
- RESTful APIs
- JWT authentication

### Frontend
- WeChat Mini-Program (WXML/WXSS)
- Vue.js 3 + Element Plus (Admin)
- Vant Weapp UI components

### Infrastructure
- Aliyun Cloud
- OSS for file storage
- WeChat APIs (login, pay)
- Baidu Maps API

## Success Metrics (Phase 1)
- **DAU**: 1,000+ daily active users
- **MAU**: 10,000+ monthly active users
- **Transactions**: 50+ completed orders/month
- **Retention**: 40% Day 7 retention
- **Revenue**: ¥5,000+ monthly GMV

## Launch Strategy
1. **Month 1**: Partner with 1-2 universities
2. **Month 2**: Beta launch with limited features
3. **Month 3**: Full MVP launch with all core features
4. **Post-launch**: Gather feedback, iterate quickly

## Risk Mitigation
- **Verification**: Manual review for student IDs
- **Payment**: Escrow system to build trust
- **Content**: Proactive moderation
- **Performance**: Optimize for mobile networks