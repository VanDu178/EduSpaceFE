import { Modal, Tag, Spin, Divider } from 'antd';
import {
  UserIcon,
  SparklesIcon,
  CreditCardIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import type { UserSubscription } from '../types';
import { STATUS_CONFIG, BILLING_CYCLE_LABELS, PAYMENT_METHOD_LABELS } from '../constants';
import CopyButton from '../../../components/CopyButton';
import { formatCurrency, formatDate } from '../../../utils/format';

interface ModalDetailProps {
  open: boolean;
  data: UserSubscription | null;
  loading: boolean;
  onClose: () => void;
}

const ModalDetail = ({ open, data, loading, onClose }: ModalDetailProps) => {
  if (!data && !loading) return null;

  const statusConfig = data ? STATUS_CONFIG[data.status] : null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
          <CreditCardIcon className="h-5 w-5 text-sky-500" />
          <span className="text-base font-semibold text-slate-800">Chi tiết</span>
        </div>
      }
      width={640}
      className="top-8"
    >
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <Spin tip="Đang tải thông tin chi tiết..." />
        </div>
      ) : data ? (
        <div className="py-3 space-y-3">
          {/* Status & Price Highlight Header */}
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Số tiền thanh toán</p>
              <p className="text-2xl font-bold text-sky-600 mt-0.5">{formatCurrency(data.pricePaid)}</p>
            </div>
            {statusConfig && (
              <Tag
                color={statusConfig.color}
                className="px-3 py-1 text-xs font-semibold rounded-full border-none m-0"
              >
                {statusConfig.label}
              </Tag>
            )}
          </div>

          {/* User & Membership Plan Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* User Info */}
            <div className="border border-slate-200/80 rounded-xl p-3.5 bg-white">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <UserIcon className="h-4 w-4 text-sky-500" />
                <span>Thông tin người dùng</span>
              </div>
              <div className="space-y-1">
                {data.user?.name ? (
                  <p className="text-sm font-semibold text-slate-800">{data.user.name}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">Chưa cập nhật</p>
                )}
                {data.user?.email ? (
                  <p className="text-xs text-slate-500">{data.user.email}</p>
                ) : (
                  <p className="text-xs text-slate-400 italic">N/A</p>
                )}
                {data.user?.code && (
                  <p className="text-xs text-slate-400 font-mono">Mã: {data.user.code}</p>
                )}
              </div>
            </div>

            {/* Plan Info */}
            <div className="border border-slate-200/80 rounded-xl p-3.5 bg-white">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <SparklesIcon className="h-4 w-4 text-amber-500" />
                <span>Gói hội viên</span>
              </div>
              <div className="space-y-1">
                {data.plan?.name ? (
                  <p className="text-sm font-semibold text-slate-800">{data.plan.name}</p>
                ) : (
                  <p className="text-sm text-slate-400 italic">Gói không xác định</p>
                )}
                <p className="text-xs text-slate-500 font-mono">
                  Mã: {data.plan?.code ? data.plan.code : <span className="text-slate-400 italic font-sans">N/A</span>}
                </p>
                <p className="text-xs text-sky-600 font-medium">
                  Chu kỳ: {BILLING_CYCLE_LABELS[data.billingCycle] || data.billingCycle}
                </p>
              </div>
            </div>
          </div>

          <Divider className=" border-slate-100 !my-2" />

          {/* Detailed Transaction Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Chi tiết giao dịch & Thời hạn
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Mã đơn đăng ký:</span>
                <span className="font-mono font-medium text-slate-700 text-xs flex items-center space-x-1">
                  <span>{data.code}</span>
                  <CopyButton text={data.code} />
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Phương thức thanh toán:</span>
                {data.paymentMethod ? (
                  <span className="font-medium text-slate-700 text-xs">
                    {PAYMENT_METHOD_LABELS[data.paymentMethod] || data.paymentMethod}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs italic">Chưa xác định</span>
                )}
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Mã giao dịch (Ref):</span>
                <span className="font-mono font-medium text-slate-700 text-xs flex items-center space-x-1">
                  {data.paymentRef ? (
                    <span>{data.paymentRef}</span>
                  ) : (
                    <span className="text-slate-400 italic font-sans">N/A</span>
                  )}
                  {data.paymentRef && <CopyButton text={data.paymentRef} />}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Tự động gia hạn:</span>
                <span className="text-xs font-medium">
                  {data.autoRenew ? (
                    <span className="flex items-center space-x-1">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>Bật</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                      <span>Tắt</span>
                    </span>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Ngày bắt đầu:</span>
                <span className="font-medium text-slate-700 text-xs flex items-center space-x-1">
                  <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatDate(data.startDate)}</span>
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Ngày hết hạn:</span>
                <span className="font-medium text-slate-700 text-xs flex items-center space-x-1">
                  <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{formatDate(data.endDate)}</span>
                </span>
              </div>
            </div>

            {/* Cancelled Details if any */}
            {data.status === 'cancelled' && (
              <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 mt-3">
                <div className="flex items-center space-x-1.5 text-rose-600 text-xs font-semibold mb-1">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span>Thông tin hủy đơn</span>
                </div>
                <p className="text-xs text-rose-700">
                  <span className="font-medium">Thời gian hủy:</span> {formatDate(data.cancelledAt, false)}
                </p>
                <p className="text-xs text-rose-700 mt-0.5">
                  <span className="font-medium">Lý do:</span> {data.cancelReason || 'Không ghi rõ'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default ModalDetail;
