// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  user_id: number;
  nickname?: string;
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  birth_date?: string;
  university_id?: number;
  major?: string;
  year?: number;
  graduation_date?: string;
  skills?: string[];
  interests?: string[];
  wechat_id?: string;
  is_verified: boolean;
  verification_status?: 'pending' | 'approved' | 'rejected';
}

// Auth Types
export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  code?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Group Types
export interface Group {
  id: number;
  name: string;
  description?: string;
  avatar?: string;
  type: 'public' | 'private';
  owner_id: number;
  member_count: number;
  created_at: string;
  updated_at: string;
  is_member?: boolean;
  member_role?: 'owner' | 'admin' | 'member';
}

export interface GroupMember {
  id: number;
  user_id: number;
  group_id: number;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  user: User;
}

// Post Types
export interface Post {
  id: number;
  user_id: number;
  group_id?: number;
  content: string;
  images?: string[];
  type: 'text' | 'image' | 'video' | 'link';
  is_pinned: boolean;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  user: User;
  group?: Group;
  is_liked?: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  parent_id?: number;
  content: string;
  like_count: number;
  created_at: string;
  updated_at: string;
  user: User;
  is_liked?: boolean;
  replies?: Comment[];
}

// Friend Types
export interface Friend {
  id: number;
  user: User;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  type: 'like' | 'comment' | 'follow' | 'friend_request' | 'system';
  title: string;
  content: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}
