import { Form, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { FormUpdate } from '../components';
import { useBlogsQuery, useUpdateBlogMutation } from '../hooks';
import { useBlogTypesQuery } from '../../blogTypes';
import type { BlogPayload } from '../types';

const UpdatePage = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data, isLoading } = useBlogsQuery({ limit: 1000 });
  const { data: blogTypes = [], isLoading: isLoadingTypes } = useBlogTypesQuery();
  const blogs = data?.blogs || [];
  const blog = blogs.find((b) => b?.id === Number(id));

  const updateMutation = useUpdateBlogMutation(() => {
    navigate('/admin/blogs');
  });

  const handleSubmit = (values: BlogPayload) => {
    if (!id) return;
    updateMutation.mutate({
      id: Number(id),
      data: values,
    });
  };

  const handleCancel = () => {
    navigate('/admin/blogs');
  };

  if (isLoading || isLoadingTypes) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Dữ liệu không tồn tại</p>
      </div>
    );
  }

  return (
    <FormUpdate
      form={form}
      blogTypes={blogTypes}
      initialData={blog}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSaving={updateMutation.isPending}
    />
  );
};

export default UpdatePage;
