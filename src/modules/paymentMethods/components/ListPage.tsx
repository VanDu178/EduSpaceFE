import { Table, Tooltip, Empty, Switch, Popconfirm, Button, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import CopyButton from '../../../components/CopyButton';
import PaymentMethodIcon from './PaymentMethodIcon';
import type { PaymentMethod } from '../types';
import { formatDate } from '../../../utils/format';

interface ListPageProps {
  data: PaymentMethod[];
  isLoading: boolean;
  onViewDetail: (record: PaymentMethod) => void;
  onEdit: (record: PaymentMethod) => void;
  onToggleStatus: (id: number) => void;
  onUpdateSortOrder: (id: number, sortOrder: number) => void;
  onDelete: (id: number) => void;
}

const ListPage = ({
  data,
  isLoading,
  onViewDetail,
  onEdit,
  onToggleStatus,
  onUpdateSortOrder,
  onDelete,
}: ListPageProps) => {
  if (!isLoading && data.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Không có dữ liệu phương thức thanh toán" />
      </div>
    );
  }


  const columns: ColumnsType<PaymentMethod> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      align: 'left',
      fixed: 'left',
      render: (code: string, record: PaymentMethod) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewDetail(record)}
            className="font-mono text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer bg-transparent border-none p-0"
            title="Click xem chi tiết"
          >
            {code}
          </button>
          <CopyButton text={code} tooltipText="Sao chép mã" successMessage="Đã sao chép mã phương thức!" />
        </div>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: PaymentMethod) => (
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-slate-800 text-xs truncate" title={name}>
            {name}
          </span>
          {record.description ? (
            <span className="text-[11px] text-slate-500 truncate max-w-xs" title={record.description}>
              {record.description}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Không có mô tả</span>
          )}
        </div>
      ),
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      width: 150,
      align: 'left',
      render: (icon: string | null) => (
        <div className="flex items-center space-x-1.5">
          {icon ? (
            <>

              <PaymentMethodIcon iconName={icon} className="h-4 w-4 text-sky-600 shrink-0" />
              <span className="font-mono text-xs text-slate-600 font-medium">{icon}</span>
            </>
          ) : (
            <span className="text-slate-400 text-xs italic">N/A</span>
          )}
        </div>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 110,
      align: 'center',
      render: (sortOrder: number, record: PaymentMethod) => (
        <InputNumber
          size="small"
          min={0}
          value={sortOrder}
          onChange={(val) => {
            if (val !== null && val !== undefined && val !== sortOrder) {
              onUpdateSortOrder(record.id, Number(val));
            }
          }}
          className="w-16 text-center font-mono text-xs rounded-lg"
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 160,
      align: 'center',
      render: (isActive: boolean, record: PaymentMethod) => (
        <div className="flex items-center justify-center gap-2">
          <Tooltip title={isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}>
            <Switch
              size="small"
              checked={isActive}
              onChange={() => onToggleStatus(record.id)}
            />
          </Tooltip>
          <span className={`font-bold text-xs ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
            {isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
          </span>
        </div>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      align: 'center',
      render: (createdAt: string) => (
        <span className="font-mono text-xs text-slate-600 font-medium">
          {formatDate(createdAt)}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record: PaymentMethod) => (
        <div className="flex items-center justify-center gap-1">
          {/* Xem chi tiết */}
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              onClick={() => onViewDetail(record)}
              icon={<EyeIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          {/* Chỉnh sửa */}
          <Tooltip title="Cập nhật">
            <Button
              type="text"
              size="small"
              onClick={() => onEdit(record)}
              icon={<PencilSquareIcon className="h-4 w-4 text-slate-500 hover:text-amber-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          {/* Xóa */}
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa phương thức này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                icon={<TrashIcon className="h-4 w-4 text-slate-500 hover:text-rose-600 transition-colors" />}
                className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden flex flex-col flex-1">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 'max-content', y: 'calc(100vh - 327px)' }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 20,
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
