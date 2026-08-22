import { Table, Button, Popconfirm, Empty, Image, Select, Switch, Tooltip } from 'antd';
import { PencilSquareIcon, TrashIcon, PhotoIcon, EyeIcon } from '@heroicons/react/24/outline';
import type { ColumnsType } from 'antd/es/table';
import type { Blog } from '../types';
import { getStatusTagConfig, getAccessTagConfig, getBlogTypeTagConfig } from '../utils';
import CopyButton from '../../../components/CopyButton';

interface BlogTableProps {
  blogs: Blog[];
  onViewDetail: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
  isUpdatingStatus?: boolean;
  updatingStatusId?: number;
  onUpdateAccess: (id: number, isPremium: boolean) => void;
  isUpdatingAccess?: boolean;
  updatingAccessId?: number;
  isLoading: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const BlogTable = ({
  blogs,
  onViewDetail,
  onEdit,
  onDelete,
  onUpdateStatus,
  isUpdatingStatus,
  updatingStatusId,
  onUpdateAccess,
  isUpdatingAccess,
  updatingAccessId,
  isLoading,
  pagination,
}: BlogTableProps) => {

  const columns: ColumnsType<Blog> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      fixed: 'left',
      align: 'left',
      render: (code, record) => (
        <div className="flex items-center gap-1">
          <span
            onClick={() => onViewDetail(record.id)}
            className="font-mono text-xs font-semibold text-slate-700 hover:text-sky-600 hover:underline hover:decoration-sky-600 transition-colors duration-150 cursor-pointer"
          >
            {code || '—'}
          </span>
          {code && (
            <CopyButton
              text={code}
              tooltipText="Sao chép mã bài viết"
              successMessage="Đã sao chép mã bài viết!"
            />
          )}
        </div>
      ),
    },
    {
      title: 'Hình ảnh',
      key: 'thumbnail',
      width: 90,
      render: (_, record) => {
        const imageUrl = record?.bannerUrl || record?.thumbnailUrl;
        if (imageUrl) {
          return (
            <Image
              src={imageUrl}
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
        <Tooltip title={text} placement="topLeft">
          <span className="font-semibold text-slate-800 line-clamp-2 hover:text-sky-600 transition-colors duration-150 cursor-pointer">
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Mô tả ngắn',
      key: 'summary',
      render: (_, record) => {
        const text = record?.summary || '';
        return (
          <Tooltip title={text || 'Không có mô tả'} placement="topLeft">
            <span className="text-slate-500 line-clamp-2 cursor-pointer">
              {text.length > 80 ? `${text.substring(0, 80)}...` : text || 'Không có mô tả'}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Thể loại',
      align: 'center',
      dataIndex: ['blogType', 'name'],
      key: 'blogType',
      width: 150,
      render: (name, record) => {
        const typeConfig = getBlogTypeTagConfig(record.blogType?.code);
        return (
          <span className={`text-xs font-bold ${typeConfig.textClass}`}>
            {name || '—'}
          </span>
        );
      },
    },
    {
      title: 'Quyền truy cập',
      align: 'center',
      key: 'isPremium',
      width: 150,
      render: (_, record) => {
        const accessConfig = getAccessTagConfig(record.isPremium);
        return (
          <div className="flex items-center justify-center gap-2">
            <Switch
              size="small"
              checked={Boolean(record.isPremium)}
              loading={isUpdatingAccess && updatingAccessId === record.id}
              disabled={isUpdatingAccess && updatingAccessId === record.id}
              onChange={(checked) => onUpdateAccess(record.id, checked)}
            />
            <span className={`text-xs font-bold ${accessConfig.textClass}`}>
              {accessConfig.label}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Tác giả',
      key: 'author',
      width: 150,
      render: (_, record) => (
        <span className="text-slate-700 font-medium text-xs">
          {record.creator?.name || '—'}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      align: "center",
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status, record) => (
        <Select
          value={status || 'draft'}
          loading={isUpdatingStatus && updatingStatusId === record.id}
          disabled={isUpdatingStatus && updatingStatusId === record.id}
          onChange={(value) => onUpdateStatus(record.id, value)}
          className="w-36 text-xs"
          options={[
            {
              value: 'draft',
              label: (
                <span className={`text-xs font-bold ${getStatusTagConfig('draft').textClass}`}>
                  {getStatusTagConfig('draft').label}
                </span>
              ),
            },
            {
              value: 'published',
              label: (
                <span className={`text-xs font-bold ${getStatusTagConfig('published').textClass}`}>
                  {getStatusTagConfig('published').label}
                </span>
              ),
            },
            {
              value: 'archived',
              label: (
                <span className={`text-xs font-bold ${getStatusTagConfig('archived').textClass}`}>
                  {getStatusTagConfig('archived').label}
                </span>
              ),
            },
          ]}
        />
      ),
    },


    {
      title: 'Hành động',
      key: 'actions',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeIcon className="h-4 w-4" />}
              onClick={() => onViewDetail(record.id)}
              className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          <Tooltip title="Cập nhật">
            <Button
              type="text"
              icon={<PencilSquareIcon className="h-4 w-4" />}
              onClick={() => onEdit(record.id)}
              className="text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          <Popconfirm
            placement='topLeft'
            title="Xóa"
            description="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<TrashIcon className="h-4 w-4" />}
                className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  if (!isLoading && blogs.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Không có dữ liệu" />
      </div>
    );
  }

  return (
    <Table
      dataSource={blogs}
      columns={columns}
      rowKey="id"
      loading={isLoading}
      scroll={{ x: 'max-content', y: 'calc(100vh - 316px)' }}
      pagination={pagination ? {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        onChange: pagination.onChange,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '50'],
        showTotal: (total) => `Tổng cộng: ${total} dòng dữ liệu`,
        style: { marginBottom: 0 }
      } : false}
    />
  );
};

export default BlogTable;
