import { Drawer, Descriptions, Image, Tooltip, Button } from 'antd';
import { CheckCircleIcon, XCircleIcon, ClockIcon, NoSymbolIcon, QuestionMarkCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import type { PaymentTransaction, PaymentTransactionStatus } from '../types';
import { formatCurrency, formatDate } from '../../../utils/format';
import CopyButton from '../../../components/CopyButton';
import { useDownloadInvoicePdf } from '../hooks/useDownloadInvoicePdf';

interface FormDetailProps {
  open: boolean;
  transaction: PaymentTransaction | null;
  onClose: () => void;
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

const FormDetail = ({ open, transaction, onClose }: FormDetailProps) => {
  const { downloadPdf, isDownloading } = useDownloadInvoicePdf();

  if (!transaction) return null;

  const statusConfig = STATUS_CONFIG[transaction.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  const userActiveSub = (transaction.user as any)?.subscriptions?.[0];
  const userActiveTier = userActiveSub?.plan?.tierLevel || 0;
  const txPlanTier = (transaction.plan as any)?.tierLevel || 0;
  const isBlockedByTier = Boolean(
    transaction.status === 'pending' &&
    userActiveTier > 0 &&
    txPlanTier > 0 &&
    txPlanTier <= userActiveTier
  );

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Chi tiết</span>}
      placement="right"
      width={480}
      open={open}
      onClose={onClose}
    >
      <div className="space-y-5">
        {isBlockedByTier && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
            <span className="font-bold block text-amber-950">Không thể duyệt đơn này</span>
            <span>
              Khách hàng đã sở hữu gói <span className="font-bold">{userActiveSub?.plan?.name || 'tương đương'}</span> (Tier {userActiveTier}).
              Đơn hàng này là gói Tier {txPlanTier} nên hệ thống không cho phép duyệt thanh toán.
            </span>
          </div>
        )}
        {/* Header card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-3">
          {transaction.qrCodeUrl ? (
            <div className="p-2 bg-white rounded-xl border border-slate-200/80 h-28 w-28 flex items-center justify-center overflow-hidden">
              <Image src={transaction.qrCodeUrl} alt="VietQR Code" height={96} className="max-h-24 max-w-full object-contain" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
              QR
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-slate-800">{formatCurrency(Number(transaction.amount))}</h3>
            <p className="text-xs text-slate-500 font-medium">Gói {transaction.plan?.name || 'Hội viên'} ({transaction.billingCycle === 'yearly' ? 'Gói theo năm' : 'Gói theo tháng'})</p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusConfig.label}</span>
            </div>

            {transaction.status === 'completed' && (
              <Button
                type="primary"
                size="small"
                loading={isDownloading(transaction.code)}
                onClick={() => downloadPdf(transaction.code)}
                icon={<ArrowDownTrayIcon className="w-3.5 h-3.5" />}
                className="!rounded-full text-xs font-medium bg-sky-600 hover:!bg-sky-700"
              >
                Tải hóa đơn
              </Button>
            )}
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <Descriptions title="Chi tiết đơn & Đối soát" column={1} bordered size="small" className="bg-white rounded-xl">
          <Descriptions.Item label="Mã giao dịch">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-800">{transaction.code}</span>
              <CopyButton text={transaction.code} tooltipText="Sao chép mã đơn" successMessage="Đã sao chép mã đơn!" />
            </div>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="inline-flex items-center gap-1.5">
                Nội dung CK
                <Tooltip title="Nội dung chuyển khoản chính xác để hệ thống ghép nối đối soát tự động.">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 transition-colors cursor-help" />
                </Tooltip>
              </span>
            }
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-800">
                {transaction.transferContent}
              </span>
              <CopyButton text={transaction.transferContent} tooltipText="Sao chép nội dung CK" successMessage="Đã sao chép nội dung chuyển khoản!" />
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <span className="inline-flex items-center gap-1.5">
                Mã tham chiếu NH
                <Tooltip title="Mã giao dịch từ phía ngân hàng (Ref No / FT No) khi nhận được tiền.">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 transition-colors cursor-help" />
                </Tooltip>
              </span>
            }
          >
            <span className="font-mono font-semibold text-slate-700">
              {transaction.paymentRef || <span className="text-slate-400 font-sans italic font-normal">Không có</span>}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Người mua">
            <div className="flex flex-col">
              {transaction.user?.name ? (
                <span className="font-semibold text-slate-800">{transaction.user.name}</span>
              ) : (
                <span className="text-slate-400 italic">Chưa cập nhật</span>
              )}
              {transaction.user?.email ? (
                <span className="text-xs text-slate-500">{transaction.user.email}</span>
              ) : (
                <span className="text-xs text-slate-400 italic">Chưa cập nhật</span>
              )}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Gói đăng ký">
            <span className="font-bold text-slate-800">
              {transaction.plan?.name || <span className="text-slate-400 font-normal italic">Chưa xác định</span>} ({transaction.billingCycle === 'yearly' ? 'Gói theo năm' : 'Gói theo tháng'})
            </span>
          </Descriptions.Item>

          <Descriptions.Item label="Ngân hàng nhận">
            <div className="flex flex-col text-xs">
              <span className="font-bold text-slate-800">
                {transaction.paymentAccount?.bank?.shortName || transaction.bankCode || <span className="text-slate-400 font-normal italic">Chưa xác định</span>}
              </span>
              <span className="font-mono text-slate-600">
                STK: {transaction.accountNo || <span className="text-slate-400 font-sans italic">Chưa cập nhật</span>}
              </span>
              <span className="text-slate-500 uppercase">
                Chủ TK: {transaction.accountHolder || <span className="text-slate-400 font-sans italic">Chưa cập nhật</span>}
              </span>
            </div>
          </Descriptions.Item>
          {transaction.status === 'completed' && (
            <Descriptions.Item label="Kênh duyệt">
              {transaction.approvalType === 'manual' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                  Duyệt thủ công
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  Tự động qua Webhook VietQR
                </span>
              )}
            </Descriptions.Item>
          )}

          {transaction.approvalType === 'manual' && (transaction.approvedByUser || transaction.approvedBy) && (
            <Descriptions.Item label="Người duyệt đơn">
              <div className="flex flex-col text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  {transaction.approvedByUser?.name || 'Admin'}
                </span>
              </div>
            </Descriptions.Item>
          )}

          <Descriptions.Item
            label={
              <span className="inline-flex items-center gap-1.5">
                Thời gian khởi tạo
                <Tooltip title="Thời điểm giao dịch được tạo trên hệ thống.">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 transition-colors cursor-help" />
                </Tooltip>
              </span>
            }
          >
            <span className="text-slate-700">{formatDate(transaction.createdAt, true)}</span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="inline-flex items-center gap-1.5">
                Thời gian hết hạn
                <Tooltip title="Thời điểm giao dịch hết hạn.">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 transition-colors cursor-help" />
                </Tooltip>
              </span>
            }
          >
            <span className="text-amber-700 font-medium">{formatDate(transaction.expiredAt, true)}</span>
          </Descriptions.Item>

          {transaction.paidAt && (
            <Descriptions.Item
              label={
                <span className="inline-flex items-center gap-1.5">
                  Thời gian duyệt
                  <Tooltip title="Thời điểm giao dịch được duyệt xác nhận thanh toán.">
                    <QuestionMarkCircleIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 transition-colors cursor-help" />
                  </Tooltip>
                </span>
              }
            >
              <span className="text-emerald-700 font-bold">{formatDate(transaction.paidAt, true)}</span>
            </Descriptions.Item>
          )}
        </Descriptions>
      </div>
    </Drawer>
  );
};

export default FormDetail;
