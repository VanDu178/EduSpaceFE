import { useQuery } from '@tanstack/react-query';
import { fetchPostTypesApi } from '../api';
import type { PostType } from '../types';

export const usePostTypesQuery = () => {
  return useQuery<PostType[]>({
    queryKey: ['postTypes'],
    queryFn: fetchPostTypesApi,
    staleTime: 5 * 60 * 1000, // Cache trong 5 phút
  });
};
