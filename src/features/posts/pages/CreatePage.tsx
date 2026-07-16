import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';
import type { AxiosError } from 'axios';
import FormCreate from '../components/FormCreate';
import { useCreatePostMutation } from '../hooks';
import type { PostType, PostPayload } from '../types';
import type { ApiResponse } from '../../../types/api';
import { handleApiError } from '../../../utils/errorHandler';

const staticPostTypes: PostType[] = [
  { id: 1, name: 'Kiến thức', code: 'KIENTHUC', description: 'Bài viết chia sẻ kiến thức' },
  { id: 2, name: 'Bài tập', code: 'BAITAP', description: 'Bài viết chứa bài tập và lời giải' },
  { id: 3, name: 'Project Log', code: 'PROJECT_LOG', description: 'Nhật ký thực hiện dự án' },
  { id: 4, name: 'Chung', code: 'GENERAL', description: 'Danh mục bài viết chung' },
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
