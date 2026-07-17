import { useNavigate } from 'react-router-dom';
import { Form, Spin } from 'antd';
import type { AxiosError } from 'axios';
import { FormCreate } from '../components';
import { useCreatePostMutation } from '../hooks';
import { usePostTypesQuery } from '../../postTypes';
import type { PostPayload } from '../types';
import type { ApiResponse } from '../../../types/api';
import { handleApiError } from '../../../utils/errorHandler';

const CreatePage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: postTypes = [], isLoading: isLoadingTypes } = usePostTypesQuery();

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

  if (isLoadingTypes) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Spin size="large" tip="Đang tải danh sách thể loại..." />
      </div>
    );
  }

  return (
    <FormCreate
      form={form}
      postTypes={postTypes}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSaving={createMutation.isPending}
    />
  );
};

export default CreatePage;
