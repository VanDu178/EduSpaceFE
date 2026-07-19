import { useNavigate, useParams } from 'react-router-dom';
import { Form, Spin, Button } from 'antd';
import type { AxiosError } from 'axios';
import { FormUpdate } from '../components';
import { usePostsQuery, useUpdatePostMutation } from '../hooks';
import { usePostTypesQuery } from '../../postTypes';
import type { PostPayload } from '../types';
import type { ApiResponse } from '../../../types/api';
import { handleApiError } from '../../../utils/errorHandler';

const UpdatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Lấy danh sách bài viết để tìm bài viết cần chỉnh sửa
  const { data, isLoading } = usePostsQuery({ limit: 1000 });
  const { data: postTypes = [], isLoading: isLoadingTypes } = usePostTypesQuery();
  const posts = data?.posts || [];
  const post = posts.find((p) => p?.id === Number(id));

  const updateMutation = useUpdatePostMutation(
    Number(id),
    () => {
      navigate('/admin/posts');
    },
    (err: AxiosError<ApiResponse>) => handleApiError(err, { form })
  );

  const handleSubmit = (values: PostPayload) => {
    updateMutation.mutate({
      id: Number(id),
      data: values,
    });
  };

  const handleCancel = () => {
    navigate('/admin/posts');
  };

  if (isLoading || isLoadingTypes) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spin size="large" tip="Đang tải dữ liệu bài viết..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl max-w-2xl mx-auto text-center mt-10">
        <p className="font-semibold text-lg">⚠️ Không tìm thấy bài viết!</p>
        <p className="text-sm mt-1">Bài viết này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <Button onClick={handleCancel} className="mt-4 rounded-xl">Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <FormUpdate
      form={form}
      postTypes={postTypes}
      initialData={post}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSaving={updateMutation.isPending}
    />
  );
};

export default UpdatePage;
