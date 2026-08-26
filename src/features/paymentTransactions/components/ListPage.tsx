import { Table, Popconfirm, Empty, Tooltip, Image, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CheckCircleIcon, XCircleIcon, ClockIcon, NoSymbolIcon, EyeIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import type { PaymentTransaction, PaymentTransactionStatus } from '../types';
import CopyButton from '../../../components/CopyButton';
import { formatCurrency, formatDate } from '../../../utils/format';

interface ListPageProps {
  transactions: PaymentTransaction[];
  isLoading: boolean;
  isApproving: boolean;
  onViewDetail: (transaction: PaymentTransaction) => void;
  onApprove: (id: number) => void;
  onCancel: (code: string) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const STATUS_CONFIG: Record<
  PaymentTransactionStatus,
  { label: string; color: string; bg: string; border: string; icon: any }
> = {
  pending: {
    label: 'Chờ thanh toán',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: ClockIcon,
  },
  completed: {
    label: 'Đã hoàn tất',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircleIcon,
  },
  expired: {
    label: 'Đã hết hạn',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    icon: XCircleIcon,
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: NoSymbolIcon,
  },
};

const ListPage = ({
  transactions,
  isLoading,
  isApproving,
  onViewDetail,
  onApprove,
  onCancel,
  pagination,
}: ListPageProps) => {
  if (!isLoading && transactions.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Chưa có giao dịch thanh toán VietQR nào" />
      </div>
    );
  }

  const columns: ColumnsType<PaymentTransaction> = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      align: 'center',
      fixed: 'left',
      render: (code: string, record: PaymentTransaction) => (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onViewDetail(record)}
            className="font-mono text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer bg-transparent border-none p-0"
            title="Click xem chi tiết"
          >
            {code}
          </button>
          <CopyButton text={code} tooltipText="Sao chép mã đơn" successMessage="Đã sao chép mã đơn!" />
        </div>
      ),
    },
    {
      title: 'Mã QR',
      dataIndex: 'qrCodeUrl',
      key: 'qrCodeUrl',
      width: 80,
      align: 'center',
      render: (qrUrl: string | null) => (
        <div className="flex items-center justify-center p-1 bg-white rounded-lg border border-slate-100 h-10 w-10 mx-auto overflow-hidden">
          {qrUrl ? (
            <Image
              src={qrUrl}
              alt="VietQR"
              height={32}
              className="max-h-8 max-w-full object-contain"
              preview={{
                mask: <EyeIcon className="h-4 w-4 text-white" />,
              }}
            />
          ) : (
            <QrCodeIcon className="h-5 w-5 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      title: 'Nội dung CK',
      dataIndex: 'transferContent',
      key: 'transferContent',
      width: 160,
      align: 'center',
      render: (content: string) => (
        <div className="flex items-center justify-center gap-1">
          <span className="font-mono text-xs font-semibold text-slate-700">
            {content}
          </span>
          <CopyButton text={content} tooltipText="Sao chép nội dung CK" successMessage="Đã sao chép nội dung chuyển khoản!" />
        </div>
      ),
    },
    {
      title: 'Người mua',
      key: 'user',
      width: 220,
      render: (_, record) => (
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-bold text-slate-800 text-xs truncate" title={record.user?.name || 'N/A'}>
            {record.user?.name || 'N/A'}
          </span>
          <span className="text-[11px] text-slate-500 truncate italic flex items-center gap-1" title={record.user?.email || ''}>
            {record.user?.email || 'N/A'}
            <CopyButton text={record.user?.email} tooltipText="Sao chép email" successMessage="Đã sao chép email!" />
          </span>
        </div>
      ),
    },
    {
      title: 'Gói đăng ký',
      key: 'plan',
      width: 160,
      render: (_, record) => (
        <div className="flex flex-col text-xs">
          <span className="font-bold text-slate-800">{record.plan?.name || 'Gói hội viên'}</span>
          <span className="text-[11px] text-slate-500 font-medium italic">
            {record.billingCycle === 'yearly' ? 'Gói theo năm' : 'Gói theo tháng'}
          </span>
        </div>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      align: 'right',
      render: (amount: number) => (
        <span className="font-bold text-slate-900 text-xs sm:text-sm">
          {formatCurrency(Number(amount))}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      align: 'center',
      render: (status: PaymentTransactionStatus) => {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
        const IconComponent = config.icon;
        return (
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border}`}
          >
            <IconComponent className="w-3.5 h-3.5" />
            <span>{config.label}</span>
          </div>
        );
      },
    },
    {
      title: 'Thời gian',
      key: 'time',
      width: 160,
      render: (_, record) => (
        <div className="flex flex-col text-[11px] text-slate-600">
          <span>Tạo: {formatDate(record.createdAt)}</span>
          {record.paidAt ? (
            <span className="text-emerald-700 font-semibold">Duyệt: {formatDate(record.paidAt)}</span>
          ) : (
            <span className="text-amber-700">Hạn: {formatDate(record.expiredAt)}</span>
          )}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 140,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1.5">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              onClick={() => onViewDetail(record)}
              icon={<EyeIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          {record.status === 'pending' && (
            <>
              <Popconfirm
                title="Xác nhận duyệt giao dịch?"
                description={`Bạn có chắc muốn duyệt đơn ${record.code}?`}
                onConfirm={() => onApprove(record.id)}
                okText="Duyệt"
                cancelText="Hủy"
              >
                <Button
                  size='small'
                  type='primary'
                  disabled={isApproving}
                >
                  Duyệt
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Hủy đơn này?"
                onConfirm={() => onCancel(record.code)}
                okText="Đồng ý"
                cancelText="Quay lại"
              >
                <Button
                  size='small'
                  type='default'
                >
                  Hủy
                </Button>
              </Popconfirm>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden flex flex-col flex-1">
      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 'max-content', y: 'calc(100vh - 327px)' }}
        pagination={
          pagination
            ? {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: pagination.onChange,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              defaultPageSize: 10,
              showTotal: (total) => `Tổng cộng: ${total} dòng dữ liệu`,
              style: { marginBottom: 0 },
            }
            : false
        }
        className="w-full"
        rowClassName="hover:bg-slate-50/50 transition-colors"
      />
    </div>
  );
};

export default ListPage;
