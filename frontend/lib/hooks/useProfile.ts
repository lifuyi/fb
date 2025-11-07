import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service';
import { ProfileData, Post, Group } from '../types';
import { handleApiError } from '../api';

export const useProfile = (userId?: number) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = userId 
        ? await profileService.getUserProfile(userId)
        : await profileService.getCurrentProfile();
      setProfile(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return { profile, isLoading, error, refetch: fetchProfile };
};

export const useProfilePosts = (userId?: number, page = 1, size = 10) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = userId
        ? await profileService.getUserPosts(userId, page, size)
        : await profileService.getCurrentUserPosts(page, size);
      setPosts(data.list);
      setPagination(data.pagination);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId, page, size]);

  return { posts, pagination, isLoading, error, refetch: fetchPosts };
};

export const useProfileGroups = (userId?: number, page = 1, size = 10) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = userId
        ? await profileService.getUserGroups(userId, page, size)
        : await profileService.getCurrentUserGroups(page, size);
      setGroups(data.list);
      setPagination(data.pagination);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [userId, page, size]);

  return { groups, pagination, isLoading, error, refetch: fetchGroups };
};
