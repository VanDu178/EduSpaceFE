import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';
import type { AxiosError } from 'axios';
import { FormCreate } from '../components';
import { useCreatePostMutation } from '../hooks';
import type { PostType, PostPayload } from '../types';
import type { ApiResponse } from '../../../types/api';
import { handleApiError } from '../../../utils/errorHandler';

const staticPostTypes: PostType[] = [
  { id: 1, name: 'Frontend Development', code: 'FRONTEND', description: 'Bài viết về Phát triển Frontend' },
  { id: 2, name: 'Backend Development', code: 'BACKEND', description: 'Bài viết về Phát triển Backend' },
  { id: 3, name: 'UI/UX Design', code: 'UIUX', description: 'Bài viết về Thiết kế Giao diện & Trải nghiệm' },
  { id: 4, name: 'DevOps', code: 'DEVOPS', description: 'Bài viết về DevOps & Triển khai' },
];

const CreatePage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const createMutation = useCreatePostMutation(
    () => {
      navigate('/admin/posts');
    },
    (err: AxiosError<ApiResponse>) => handleApiError(err, { form })
  );

  const handleSubmit = (values: PostPayload) => {
    createMutation.mutate(values);
  };

  const handleCancel = () => {
    navigate('/admin/posts');
  };

  return (
    <FormCreate
      form={form}
      postTypes={staticPostTypes}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSaving={createMutation.isPending}
    />
  );
};

export default CreatePage;
