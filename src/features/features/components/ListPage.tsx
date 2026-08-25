import { useState, useEffect } from 'react';
import { Table, Switch, Popconfirm, Button, Tooltip, Empty, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Feature } from '../types';
import CopyButton from '../../../components/CopyButton';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../utils/format';

interface ListPageProps {
  features: Feature[];
  isLoading: boolean;
  onViewDetail: (feature: Feature) => void;
  onEdit: (feature: Feature) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onUpdateSortOrder: (id: number, sortOrder: number) => void;
}

const SortOrderCell = ({
  record,
  onUpdateSortOrder,
}: {
  record: Feature;
  onUpdateSortOrder: (id: number, sortOrder: number) => void;
}) => {
  const [value, setValue] = useState<number | null>(record.sortOrder ?? 0);

  useEffect(() => {
    setValue(record.sortOrder ?? 0);
  }, [record.sortOrder]);

  const handleSave = () => {
    if (value === null || value === undefined || value === record.sortOrder) return;
    onUpdateSortOrder(record.id, Number(value));
  };

  return (
    <InputNumber
      min={0}
      value={value}
      onChange={(v) => setValue(v)}
      onBlur={handleSave}
      onPressEnter={handleSave}
      size="small"
      className="w-20 rounded-lg text-center font-semibold"
    />
  );
};

const ListPage = ({
  features,
  isLoading,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleStatus,
  onUpdateSortOrder,
}: ListPageProps) => {
  if (!isLoading && features.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Không có tính năng nào" />
      </div>
    );
  }

  const columns: ColumnsType<Feature> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      width: 200,
      fixed: 'left',
      render: (code: string, record: Feature) => (
        <div className="flex items-center space-x-1 font-mono text-xs text-slate-700 w-fit">
          <button
            type="button"
            onClick={() => onViewDetail(record)}
            className="font-semibold hover:text-sky-600 hover:underline cursor-pointer border-none bg-transparent p-0 text-left font-mono text-xs text-slate-700 font-medium"
            title="Xem chi tiết"
          >
            {code}
          </button>
          <CopyButton text={code} tooltipText="Sao chép mã tính năng" successMessage="Đã sao chép mã tính năng!" />
        </div>
      ),
    },
    {
      title: 'Tên tính năng',
      dataIndex: 'name',
      key: 'name',
      width: 240,
      render: (name: string) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-sm">{name}</span>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (description: string | null) => (
        <span className="text-xs text-slate-600 line-clamp-2">
          {description || <span className="text-slate-400 italic">Không có mô tả</span>}
        </span>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 110,
      align: 'center',
      render: (_: any, record: Feature) => (
        <SortOrderCell record={record} onUpdateSortOrder={onUpdateSortOrder} />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 130,
      align: 'center',
      render: (isActive: boolean, record: Feature) => (
        <div className="flex items-center justify-center !space-x-2">
          <Switch
            checked={isActive}
            onChange={() => onToggleStatus(record.id)}
            size="small"
            className={isActive ? 'bg-sky-500' : 'bg-slate-300'}
          />
          <span className={`text-xs font-medium ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
            {isActive ? 'Kích hoạt' : 'Ẩn'}
          </span>
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (createdAt: string) => (
        <span className="text-xs text-slate-500">{formatDate(createdAt, false, '—')}</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 130,
      align: 'center',
      fixed: 'right',
      render: (_: any, record: Feature) => (
        <div className="flex items-center justify-center space-x-1">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              onClick={() => onViewDetail(record)}
              icon={<EyeIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              onClick={() => onEdit(record)}
              icon={<PencilSquareIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa tính năng"
              description="Bạn có chắc chắn muốn xóa tính năng này không?"
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true, className: 'rounded-lg' }}
              cancelButtonProps={{ className: 'rounded-lg' }}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<TrashIcon className="h-4 w-4 text-rose-500 hover:text-rose-700 transition-colors" />}
                className="p-1 hover:bg-rose-50 rounded-lg flex items-center justify-center"
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden flex flex-col flex-1">
      <Table
        columns={columns}
        dataSource={features}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 'max-content', y: 'calc(100vh - 386px)' }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (total) => `Tổng cộng: ${total} dòng dữ liệu`,
          style: { marginBottom: 0 },
        }}
        className="w-full"
        rowClassName="hover:bg-slate-50/50 transition-colors"
      />
    </div>
  );
};

export default ListPage;
