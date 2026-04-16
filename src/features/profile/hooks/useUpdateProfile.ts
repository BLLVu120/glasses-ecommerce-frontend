// src/features/profile/hooks/useUpdateProfile.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../api/api';
import { PROFILE_QUERY_KEY } from './useProfileQuery';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => profileApi.updateProfile(data),
    onSuccess: () => {
      // 1. Refresh user data immediately
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      // 2. Show success message
    },
    onError: (error) => {
      console.error('Update failed', error);
    },
  });
};
