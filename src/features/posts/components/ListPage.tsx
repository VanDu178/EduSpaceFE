import { Table, Tag, Button, Popconfirm, Empty, Image, Switch } from 'antd';
import { PencilSquareIcon, TrashIcon, PhotoIcon, EyeIcon } from '@heroicons/react/24/outline';
import type { ColumnsType } from 'antd/es/table';
import type { Post } from '../types';
import { getPostTypeStyles } from '../utils';

interface PostTableProps {
  posts: Post[];
  onViewDetail: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, published: boolean) => void;
  isUpdatingStatus?: boolean;
  updatingStatusId?: number;
  isLoading: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const PostTable = ({
  posts,
  onViewDetail,
  onEdit,
  onDelete,
  onUpdateStatus,
  isUpdatingStatus,
  updatingStatusId,
  isLoading,
  pagination,
}: PostTableProps) => {

  const columns: ColumnsType<Post> = [
    {
      title: 'Hình ảnh',
      key: 'thumbnail',
      width: 90,
      render: (_, record) => {
        if (record?.thumbnail) {
          return (
            <Image
              src={record?.thumbnail}
              alt={record?.title}
              className="w-12 h-12 rounded-lg object-cover border border-slate-100"
            />
          );
        }
        return (
          <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-400">
            <PhotoIcon className="h-6 w-6" />
          </div>
        );
      },
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (text) => (
        <span className="font-semibold text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors duration-150">
          {text}
        </span>
      ),
    },
    {
      title: 'Mô tả ngắn',
      key: 'summary',
      render: (_, record) => {
        const text = record?.summary || '';
        return (
          <span className="text-slate-500 line-clamp-2">
            {text.length > 80 ? `${text.substring(0, 80)}...` : text || 'Không có mô tả'}
          </span>
        );
      },
    },
    {
      title: 'Thể loại',
      dataIndex: ['postType', 'name'],
      key: 'postType',
      width: 150,
      render: (name, record) => {
        const color = getPostTypeStyles(record.postType?.code);
        return (
          <Tag color={color} className="font-semibold px-2.5 py-0.5 rounded-full border-none">
            {name || 'Chung'}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      align: "center",
      dataIndex: 'published',
      key: 'published',
      width: 150,
      render: (published, record) => (
        <Switch
          checked={published}
          loading={isUpdatingStatus && updatingStatusId === record.id}
          onChange={(checked) => onUpdateStatus(record.id, checked)}
          checkedChildren="Đã xuất bản"
          unCheckedChildren="Bản nháp"
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <div >
          <Button
            type="text"
            icon={<EyeIcon className="h-4 w-4" />}
            onClick={() => onViewDetail(record.id)}
            className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center"
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<PencilSquareIcon className="h-4 w-4" />}
            onClick={() => onEdit(record.id)}
            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center"
            title="Cập nhật"
          />
          <Popconfirm
            placement='topLeft'
            title="Xóa"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<TrashIcon className="h-4 w-4" />}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center"
              title="Xóa"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Nếu không có dữ liệu, ẩn Table hoàn toàn và hiển thị giao diện trống
  if (!isLoading && posts.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Không có bài viết nào" />
      </div>
    );
  }

  return (
    <Table
      dataSource={posts}
      columns={columns}
      rowKey="id"
      loading={isLoading}
      scroll={{ y: 'calc(100vh - 316px)' }}
      pagination={pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: pagination.onChange,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        style: { marginBottom: 0 }
      } : false}
    />
  );
};

export default PostTable;
