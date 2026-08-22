import { useQuery } from '@tanstack/react-query';
import { fetchBlogTypesApi } from '../api';
import type { BlogType } from '../types';

export const useBlogTypesQuery = () => {
  return useQuery<BlogType[]>({
    queryKey: ['blogTypes'],
    queryFn: fetchBlogTypesApi
  });
};
