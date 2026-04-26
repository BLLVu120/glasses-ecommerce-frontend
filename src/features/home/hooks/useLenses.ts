import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/product-api';

export const useLenses = () => {
  const query = useQuery({
    queryKey: ['lenses'],
    queryFn: productApi.getLenses,
    staleTime: 5 * 60 * 1000,
  });

  return {
    lenses: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
