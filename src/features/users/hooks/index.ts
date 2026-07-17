import { useQuery } from '@tanstack/react-query';
import { fetchUsersApi } from '../api';
import type { User } from '../types';

// Danh sách mockup người dùng mẫu để dự phòng
const mockUsersFallback: User[] = [
  { id: 1, name: 'Nguyễn Văn A', email: 'vanda@eduspace.vn', role: 'admin', createdAt: '2026-06-15T08:30:00Z' },
  { id: 2, name: 'Trần Thị B', email: 'thib@eduspace.vn', role: 'client', createdAt: '2026-06-20T09:15:00Z' },
  { id: 3, name: 'Phạm Minh C', email: 'minhc@eduspace.vn', role: 'client', createdAt: '2026-07-01T14:45:00Z' },
  { id: 4, name: 'Hoàng Văn D', email: 'vand@eduspace.vn', role: 'client', createdAt: '2026-07-05T10:00:00Z' },
  { id: 5, name: 'Lê Thanh E', email: 'thanhe@eduspace.vn', role: 'client', createdAt: '2026-07-10T16:20:00Z' },
];

export const useUsersQuery = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await fetchUsersApi();
      } catch (err) {
        console.warn('GET /users failed or not implemented yet. Falling back to mock users.', err);
        
        let finalUsers = [...mockUsersFallback];
        
        // Thêm tài khoản hiện tại từ localStorage vào danh sách hiển thị
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const currentUser = JSON.parse(storedUser) as User;
            const filtered = finalUsers.filter(u => u.email !== currentUser.email);
            finalUsers = [
              {
                id: currentUser.id || 99,
                name: currentUser.name || 'Admin',
                email: currentUser.email,
                role: currentUser.role || 'admin',
                createdAt: currentUser.createdAt || new Date().toISOString(),
              },
              ...filtered
            ];
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
        return finalUsers;
      }
    }
  });
};
