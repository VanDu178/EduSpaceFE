import { useQuery } from '@tanstack/react-query';
import { fetchBlogTypesApi } from '../api';
import type { BlogType } from '../types';

export const QUERY_KEY = ['blogTypes'];

export const useBlogTypesQuery = () => {
  return useQuery<BlogType[]>({
    queryKey: QUERY_KEY,
    queryFn: fetchBlogTypesApi
  });
};
