import { Form, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FormCreate } from '../components';
import { useCreateBlogMutation } from '../hooks';
import { useBlogTypesQuery } from '../../blogTypes';
import type { BlogPayload } from '../types';

const CreatePage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data: blogTypes = [], isLoading: isLoadingTypes } = useBlogTypesQuery();

  const createMutation = useCreateBlogMutation(() => {
    navigate('/admin/blogs');
  });

  const handleSubmit = (values: BlogPayload) => {
    createMutation.mutate(values);
  };

  const handleCancel = () => {
    navigate('/admin/blogs');
  };

  if (isLoadingTypes) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <FormCreate
      form={form}
      blogTypes={blogTypes}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSaving={createMutation.isPending}
    />
  );
};

export default CreatePage;
