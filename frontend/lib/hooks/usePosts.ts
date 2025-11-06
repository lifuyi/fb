import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService, CreatePostData, CreateCommentData } from '../services/post.service';

export function usePosts(groupId?: number) {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts', groupId],
    queryFn: ({ pageParam = 1 }) => postService.getFeed(pageParam, groupId),
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const createPostMutation = useMutation({
    mutationFn: (postData: CreatePostData) => postService.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: number) => postService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: (postId: number) => postService.toggleLike(postId),
    onMutate: async (postId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousData = queryClient.getQueryData(['posts', groupId]);
      
      queryClient.setQueryData(['posts', groupId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    is_liked: !post.is_liked,
                    like_count: post.is_liked ? post.like_count - 1 : post.like_count + 1,
                  }
                : post
            ),
          })),
        };
      });
      
      return { previousData };
    },
    onError: (err, postId, context) => {
      queryClient.setQueryData(['posts', groupId], context?.previousData);
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({ postId, commentData }: { postId: number; commentData: CreateCommentData }) =>
      postService.addComment(postId, commentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const posts = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    posts,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    createPost: createPostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    toggleLike: toggleLikeMutation.mutate,
    addComment: addCommentMutation.mutate,
    isCreatingPost: createPostMutation.isPending,
  };
}
