import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lensApi } from '../api/lens-api';
import type { CreateLensRequest } from '../types/lens';
import { toast } from 'sonner';

export const useLenses = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['lenses'],
    queryFn: lensApi.getAll,
    select: (data) => data.result,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  }); // 2. CREATE - Thêm mới sản phẩm
  const createMutation = useMutation({
    mutationFn: (payload: CreateLensRequest) => lensApi.create(payload),

    // Khi bắt đầu gửi request, hiện loading toast
    onMutate: () => {
      toast.loading('Đang gửi yêu cầu...', { id: 'lens-action' });
    }, // 2. CREATE - Thêm mới sản phẩm
  const createMutation = useMutation({
    mutationFn: (payload: CreateLensRequest) => lensApi.create(payload),

    // Khi bắt đầu gửi request, hiện loading toast
    onMutate: () => {
      toast.loading('Đang gửi yêu cầu...', { id: 'lens-action' });
    },

  // 2. CREATE - Thêm mới sản phẩm
  const createMutation = useMutation({
    mutationFn: (payload: CreateLensRequest) => lensApi.create(payload),

    // Khi bắt đầu gửi request, hiện loading toast
    onMutate: () => {
      toast.loading('Đang gửi yêu cầu...', { id: 'lens-action' });
    },

    // Khi thành công
    onSuccess: () => {
      // Làm mới danh sách tròng kính ngay lập tức
      queryClient.invalidateQueries({ queryKey: ['lenses'] });
      // Cập nhật toast hiện tại sang success
      toast.success('Thêm tròng kính mới thành công!', { id: 'lens-action' });
    },

    // Khi thất bại
    onError: () => {
      toast.error(`Lỗi: Không thể tạo sản phẩm'}`, { id: 'lens-action' });
    },
  });

  return {
    // Data & Loading state cho danh sách
    lenses: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    // Actions
    createLens: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
};
