// src/features/users/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, type UserRole } from '../api/user-api';

export const useUsers = (role: UserRole) => {
  return useQuery({
    queryKey: ['users', role],
    queryFn: () => userApi.getUsersByRole(role),
  });
};

export const useDeleteUser = (role: UserRole) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', role] }),
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.assignRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.assignRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.assignRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
