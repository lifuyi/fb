import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupService, CreateGroupData } from '../services/group.service';

export function useGroups() {
  const queryClient = useQueryClient();

  const { data: groupsData, isLoading, error } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupService.getGroups(1),
  });

  const createGroupMutation = useMutation({
    mutationFn: (groupData: CreateGroupData) => groupService.createGroup(groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const joinGroupMutation = useMutation({
    mutationFn: (groupId: number) => groupService.joinGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const leaveGroupMutation = useMutation({
    mutationFn: (groupId: number) => groupService.leaveGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGroupData> }) =>
      groupService.updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (groupId: number) => groupService.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  return {
    groups: groupsData?.data ?? [],
    isLoading,
    error,
    createGroup: createGroupMutation.mutate,
    joinGroup: joinGroupMutation.mutate,
    leaveGroup: leaveGroupMutation.mutate,
    updateGroup: (id: number, data: Partial<CreateGroupData>) => updateGroupMutation.mutate({ id, data }),
    deleteGroup: deleteGroupMutation.mutate,
    isCreatingGroup: createGroupMutation.isPending,
  };
}

export function useGroup(groupId: number) {
  const queryClient = useQueryClient();

  const { data: group, isLoading, error } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupService.getGroup(groupId),
    enabled: !!groupId,
  });

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: () => groupService.getMembers(groupId),
    enabled: !!groupId,
  });

  const updateGroupMutation = useMutation({
    mutationFn: (groupData: Partial<CreateGroupData>) =>
      groupService.updateGroup(groupId, groupData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  return {
    group,
    members,
    isLoading,
    isLoadingMembers,
    error,
    updateGroup: updateGroupMutation.mutate,
  };
}
