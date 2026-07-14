import { Table, Tag, Badge, Space, Button, Popconfirm, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, PictureOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Post } from '../types';

interface PostTableProps {
  posts: Post[];
  onViewDetail: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const PostTable = ({ posts, onViewDetail, onEdit, onDelete, isLoading }: PostTableProps) => {
  // Lấy kiểu màu sắc tương ứng cho loại bài viết (badge)
  const getPostTypeStyles = (code?: string) => {
    const normCode = code?.toUpperCase() || 'GENERAL';
    switch (normCode) {
      case 'KIENTHUC':
      case 'KIEN_THUC':
        return 'purple';
      case 'BAITAP':
      case 'BAI_TAP':
        return 'emerald';
      case 'PROJECT_LOG':
      case 'PROJECTLOG':
        return 'amber';
      default:
        return 'blue';
    }
  };

  const columns: ColumnsType<Post> = [
    {
      title: 'Hình ảnh',
      key: 'thumbnail',
      width: 90,
      render: (_, record) => {
        if (record.thumbnail) {
          return (
            <img
              src={record.thumbnail}
              alt={record.title}
              className="w-12 h-12 rounded-lg object-cover border border-slate-100 shadow-sm"
            />
          );
        }
        return (
          <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-400">
            <PictureOutlined className="text-lg" />
          </div>
        );
      },
    },
    {
      title: 'Tiêu đề bài viết',
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
        const text = record.summary || record.content || '';
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
      dataIndex: 'published',
      key: 'published',
      width: 140,
      render: (published) => (
        <Badge
          status={published ? 'success' : 'warning'}
          text={published ? 'Đã xuất bản' : 'Bản nháp'}
          className="font-semibold text-xs"
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(record.id)}
            className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record.id)}
            className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Sửa bài viết"
          />
          <Popconfirm
            title="Xóa bài viết"
            description={`Bạn có chắc chắn muốn xóa bài viết "${record.title}"?`}
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              title="Xóa bài viết"
            />
          </Popconfirm>
        </Space>
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
      size="middle"
      scroll={{ x: true, y: 'calc(100vh - 370px)' }}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
        className: 'pr-6 my-4 shrink-0',
      }}
      className="flex-1 flex flex-col overflow-hidden [&_.ant-spin-nested-loading]:flex-1 [&_.ant-spin-nested-loading]:flex [&_.ant-spin-nested-loading]:flex-col [&_.ant-spin-container]:flex-1 [&_.ant-spin-container]:flex [&_.ant-spin-container]:flex-col [&_.ant-table]:flex-1 [&_.ant-table]:flex [&_.ant-table]:flex-col [&_.ant-table-container]:flex-1 [&_.ant-table-container]:flex [&_.ant-table-container]:flex-col [&_.ant-table-content]:flex-1 [&_.ant-table-content]:overflow-auto [&_.ant-table]:bg-transparent [&_.ant-table-thead_tr_th]:bg-slate-50/75 [&_.ant-table-thead_tr_th]:text-slate-500 [&_.ant-table-thead_tr_th]:font-semibold [&_.ant-table-thead_tr_th]:text-xs [&_.ant-table-thead_tr_th]:uppercase [&_.ant-table-thead_tr_th]:tracking-wider [&_.ant-table-thead_tr_th]:border-b [&_.ant-table-thead_tr_th]:border-slate-200 [&_.ant-table-row]:hover:bg-slate-50/50 [&_.ant-table-cell]:py-4 [&_.ant-table-cell]:px-6"
    />
  );
};

export default PostTable;
