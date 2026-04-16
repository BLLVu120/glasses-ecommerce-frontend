import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../api/api';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';

export const PROFILE_QUERY_KEY = ['profile'];

export const useProfileQuery = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1,
    enabled: isAuthenticated,
  });
};
