import { Drawer, Descriptions, Image, Tooltip, Button } from 'antd';
import { CheckCircleIcon, XCircleIcon, ClockIcon, NoSymbolIcon, QuestionMarkCircleIcon, ArrowDownTrayIcon, BanknotesIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import type { PaymentTransaction, PaymentTransactionStatus, PaymentRefund } from '../types';
import { formatCurrency, formatDate } from '../../../utils/format';
import CopyButton from '../../../components/CopyButton';
import { useDownloadInvoicePdf } from '../hooks';

interface FormDetailProps {
  open: boolean;
  transaction: PaymentTransaction | null;
  onClose: () => void;
  onOpenRefund?: (transaction: PaymentTransaction) => void;
  onOpenEditRefund?: (refund: PaymentRefund, transaction: PaymentTransaction) => void;
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
  partially_paid: {
    label: 'Thanh toán thiếu',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: ClockIcon,
  },
  completed: {
    label: 'Đã hoàn tất',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: CheckCircleIcon,
  },
  overpaid: {
    label: 'Thanh toán dư',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
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

const FormDetail = ({ open, transaction, onClose, onOpenRefund, onOpenEditRefund }: FormDetailProps) => {
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

  const amount = Number(transaction.amount);
  const paidAmount = Number(transaction.paidAmount || 0);
  const overpaidAmount = Number(transaction.overpaidAmount || Math.max(0, paidAmount - amount));
  const remainingAmount = Number(transaction.remainingAmount || Math.max(0, amount - paidAmount));

  const refundsList = transaction.refunds || [];
  const totalRefunded = Number(transaction.totalRefundedAmount || refundsList.reduce((acc, r) => acc + Number(r.amount), 0));
  const canRefund = (transaction.status === 'completed' || transaction.status === 'overpaid') && overpaidAmount > 0 && totalRefunded < overpaidAmount;

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Chi tiết</span>}
      placement="right"
      width={520}
      open={open}
      onClose={onClose}
    >
      <div className="space-y-5">
        {isBlockedByTier && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
            <span className="font-bold block text-amber-950">Không thể duyệt</span>
            <span>
              Khách hàng đã sở hữu gói dịch vụ tương đương hoặc cao hơn.
              Hệ thống không cho phép duyệt thanh toán.
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
            <h3 className="text-xl font-bold text-slate-800">{formatCurrency(amount)}</h3>
            <p className="text-xs text-slate-500 font-medium">Gói {transaction.plan?.name || 'Hội viên'} ({transaction.billingCycle === 'yearly' ? 'Gói theo năm' : 'Gói theo tháng'})</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{statusConfig.label}</span>
            </div>

            {(transaction.status === 'completed' || transaction.status === 'overpaid') && (
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

            {canRefund && onOpenRefund && (
              <Button
                type="default"
                size="small"
                onClick={() => onOpenRefund(transaction)}
                icon={<BanknotesIcon className="w-3.5 h-3.5 text-emerald-600" />}
                className="!rounded-full text-xs font-medium border-emerald-300 text-emerald-700 hover:!border-emerald-500"
              >
                Xác nhận hoàn tiền dư
              </Button>
            )}
          </div>
        </div>

        {/* Cảnh báo nạp thừa / nạp thiếu */}
        {transaction.status === 'partially_paid' && (
          <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-xs space-y-1 text-orange-900">
            <span className="font-bold block text-orange-950">⚠️ Đơn hàng nạp thiếu tiền:</span>
            <div>Đã nạp: <strong className="font-bold">{formatCurrency(paidAmount)}</strong> / Giá trị đơn: <strong className="font-bold">{formatCurrency(amount)}</strong></div>
            <div className="text-orange-950 font-bold">Còn thiếu: {formatCurrency(remainingAmount)}</div>
          </div>
        )}

        {(transaction.status === 'completed' || transaction.status === 'overpaid') && overpaidAmount > 0 && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-900">
            <span className="font-bold block text-emerald-950">🎉 Giao dịch nạp thừa tiền:</span>
            <div>Số tiền khách đã nạp: <strong className="font-bold">{formatCurrency(paidAmount)}</strong></div>
            <div>Số tiền thừa ghi nhận: <strong className="font-bold text-emerald-700">{formatCurrency(overpaidAmount)}</strong></div>
            <div>Đã hoàn trả CSKH: <strong className="font-bold">{formatCurrency(totalRefunded)}</strong></div>
          </div>
        )}

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
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-slate-700">
                {transaction.paymentRef || <span className="text-slate-400 font-sans italic font-normal">Không có</span>}
              </span>
              <CopyButton
                text={transaction.paymentRef}
                tooltipText="Sao chép mã tham chiếu NH"
                successMessage="Đã sao chép mã tham chiếu ngân hàng!"
              />
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Số tiền đã nạp">
            <span className="font-bold text-slate-900 text-sm">
              {formatCurrency(paidAmount > 0 ? paidAmount : amount)}
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

          {transaction.notes && (
            <Descriptions.Item label="Nhật ký giao dịch">
              <p className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{transaction.notes}</p>
            </Descriptions.Item>
          )}

          {(transaction.status === 'completed' || transaction.status === 'overpaid') && (
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

          <Descriptions.Item label="Thời gian khởi tạo">
            <span className="text-slate-700">{formatDate(transaction.createdAt, true)}</span>
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian hết hạn">
            <span className="text-amber-700 font-medium">{formatDate(transaction.expiredAt, true)}</span>
          </Descriptions.Item>

          {transaction.paidAt && (
            <Descriptions.Item label="Thời gian duyệt">
              <span className="text-emerald-700 font-bold">{formatDate(transaction.paidAt, true)}</span>
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Lịch sử phiếu hoàn tiền (PaymentRefund[]) */}
        {refundsList.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <BanknotesIcon className="w-4 h-4 text-emerald-600" />
              <span>Phiếu hoàn tiền CSKH ({refundsList.length})</span>
            </h4>

            <div className="space-y-3">
              {refundsList.map((refund: PaymentRefund) => (
                <div key={refund.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sky-600">{refund.code}</span>
                      {onOpenEditRefund && (
                        <Tooltip title="Chỉnh sửa thông tin / minh chứng hoàn tiền">
                          <Button
                            type="text"
                            size="small"
                            icon={<PencilSquareIcon className="w-3.5 h-3.5 text-amber-600 hover:text-amber-700" />}
                            onClick={() => onOpenEditRefund(refund, transaction)}
                            className="p-1 h-6 w-6 hover:bg-amber-50 rounded-lg shrink-0 flex items-center justify-center border-none"
                          />
                        </Tooltip>
                      )}
                    </div>
                    <span className="font-bold text-emerald-700 text-sm">{formatCurrency(Number(refund.amount))}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mã GD Ngân hàng:</span>
                      <span className="font-mono font-semibold text-slate-800">{refund.refundRef || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Thời gian hoàn:</span>
                      <span className="font-medium text-slate-800">{formatDate(refund.createdAt, true)}</span>
                    </div>
                  </div>

                  {refund.refundedByUser && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">Người thực hiện:</span>
                      <span className="font-semibold text-slate-800">{refund.refundedByUser.name || refund.refundedByUser.email}</span>
                    </div>
                  )}

                  {refund.notes && (
                    <div>
                      <span className="text-slate-400 block text-[10px]">Ghi chú đối soát:</span>
                      <p className="text-slate-700 italic">{refund.notes}</p>
                    </div>
                  )}

                  {refund.proofUrls && refund.proofUrls.length > 0 && (
                    <div className="pt-1">
                      <span className="text-slate-400 block text-[10px] mb-1">Minh chứng bill chuyển khoản ({refund.proofUrls.length} ảnh):</span>
                      <Image.PreviewGroup>
                        <div className="flex gap-2 flex-wrap">
                          {refund.proofUrls.map((url, i) => (
                            <Image
                              key={i}
                              src={url}
                              alt={`Minh chứng ${i + 1}`}
                              height={48}
                              width={48}
                              className="rounded-lg object-cover border border-slate-200"
                            />
                          ))}
                        </div>
                      </Image.PreviewGroup>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default FormDetail;
