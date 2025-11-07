import { useState, useEffect } from 'react';
import { followService } from '../services/follow.service';
import { User } from '../types';
import { handleApiError } from '../api';

export const useFollowStatus = (userId: number) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkStatus = async () => {
    try {
      setIsLoading(true);
      const status = await followService.checkFollowStatus(userId);
      setIsFollowing(status);
    } catch (err) {
      console.error('Failed to check follow status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      checkStatus();
    }
  }, [userId]);

  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await followService.unfollow(userId);
        setIsFollowing(false);
      } else {
        await followService.follow(userId);
        setIsFollowing(true);
      }
    } catch (err) {
      throw new Error(handleApiError(err));
    }
  };

  return { isFollowing, isLoading, toggleFollow, refetch: checkStatus };
};

export const useFollowing = (userId?: number, page = 1, size = 20) => {
  const [following, setFollowing] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowing = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await followService.getFollowing(userId, page, size);
      setFollowing(data.list);
      setPagination(data.pagination);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, [userId, page, size]);

  return { following, pagination, isLoading, error, refetch: fetchFollowing };
};

export const useFollowers = (userId?: number, page = 1, size = 20) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await followService.getFollowers(userId, page, size);
      setFollowers(data.list);
      setPagination(data.pagination);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [userId, page, size]);

  return { followers, pagination, isLoading, error, refetch: fetchFollowers };
};
