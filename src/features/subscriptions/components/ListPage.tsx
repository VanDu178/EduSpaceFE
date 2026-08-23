import { Table, Button, Tooltip, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { UserSubscription, SubscriptionStatus } from '../types';
import { STATUS_CONFIG, BILLING_CYCLE_LABELS, PAYMENT_METHOD_LABELS } from '../constants';
import CopyButton from '../../../components/CopyButton';
import { formatCurrency, formatDate } from '../../../utils/format';

interface ListPageProps {
  subscriptions: UserSubscription[];
  isLoading: boolean;
  onViewDetail: (subscription: UserSubscription) => void;
  onViewPlanDetail?: (planId: number) => void;
  onEdit: (subscription: UserSubscription) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const ListPage = ({
  subscriptions,
  isLoading,
  onViewDetail,
  onViewPlanDetail,
  onEdit,
  pagination,
}: ListPageProps) => {
  if (!isLoading && subscriptions.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Không có lịch sử thanh toán nào" />
      </div>
    );
  }

  const columns: ColumnsType<UserSubscription> = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      fixed: 'left',
      render: (code: string, record: UserSubscription) => (
        <div className="flex items-center space-x-1 font-mono text-xs text-slate-700 w-fit">
          <button
            type="button"
            onClick={() => onViewDetail(record)}
            className="font-semibold hover:text-sky-600 hover:underline cursor-pointer border-none bg-transparent p-0 text-left font-mono text-xs text-slate-700 font-medium"
            title="Xem chi tiết"
          >
            {code}
          </button>
          <CopyButton text={code} tooltipText="Sao chép mã đơn" successMessage="Đã sao chép mã đơn!" />
        </div>
      ),
    },
    {
      title: 'Người dùng',
      key: 'user',
      width: 220,
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-xs">{record.user?.name || 'N/A'}</span>
          <span className="text-[11px] text-slate-400">{record.user?.email || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Gói hội viên',
      key: 'plan',
      width: 160,
      render: (_, record) => (
        <button
          type="button"
          onClick={() => record.planId && onViewPlanDetail?.(record.planId)}
          className="font-semibold text-slate-800 text-xs hover:text-sky-600 hover:underline cursor-pointer border-none bg-transparent p-0 text-left"
          title="Xem chi tiết gói hội viên"
        >
          {record.plan?.name || 'Gói khác'}
        </button>
      ),
    },
    {
      title: 'Chu kỳ thanh toán',
      key: 'billingCycle',
      align: "center",
      width: 150,
      render: (_, record) => {
        const isYearly = record.billingCycle === 'yearly';
        const label = BILLING_CYCLE_LABELS[record.billingCycle] || record.billingCycle;
        return (
          <span className={`font-semibold text-xs ${isYearly ? 'text-blue-600' : 'text-sky-600'}`}>
            {label}
          </span>
        );
      },
    },
    {
      title: 'Số tiền',
      dataIndex: 'pricePaid',
      key: 'pricePaid',
      width: 130,
      align: 'right',
      render: (price: number) => (
        <span className="font-bold text-slate-800 text-xs">{formatCurrency(price)}</span>
      ),
    },
    {
      title: 'Phương thức thanh toán',
      key: 'payment',
      width: 220,
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="text-xs text-slate-700 font-medium">
            {record.paymentMethod
              ? PAYMENT_METHOD_LABELS[record.paymentMethod] || record.paymentMethod
              : 'Chưa xác định'}
          </span>
          {record.paymentRef && (
            <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
              <span>{record.paymentRef}</span>
              <CopyButton text={record.paymentRef} tooltipText="Sao chép mã giao dịch" successMessage="Đã sao chép mã giao dịch!" />
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Thời hạn',
      key: 'period',
      align: "center",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="font-semibold">{formatDate(record.startDate)}</span>
          <span className="text-slate-400">đến</span>
          <span className="font-semibold">{formatDate(record.endDate)}</span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: SubscriptionStatus) => {
        const config = STATUS_CONFIG[status] || { label: status, textColor: 'text-slate-600' };
        return (
          <span className={`font-semibold text-xs ${config.textColor}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 110,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
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

          <Tooltip title="Cập nhật">
            <Button
              type="text"
              size="small"
              onClick={() => onEdit(record)}
              icon={<PencilSquareIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden flex flex-col flex-1">
      <Table
        columns={columns}
        dataSource={subscriptions}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 'max-content', y: 'calc(100vh - 316px)' }}
        pagination={
          pagination
            ? {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: pagination.onChange,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total) => `Tổng cộng: ${total} dòng dữ liệu`,
              style: { marginBottom: 0 },
            }
            : {
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total) => `Tổng cộng: ${total} dòng dữ liệu`,
              style: { marginBottom: 0 },
            }
        }
        className="w-full"
        rowClassName="hover:bg-slate-50/50 transition-colors"
      />
    </div>
  );
};

export default ListPage;
