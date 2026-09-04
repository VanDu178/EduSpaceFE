import { Modal, Tag, Spin, Divider, Image } from 'antd';
import {
  UserIcon,
  SparklesIcon,
  CreditCardIcon,
  CalendarIcon,
  ClockIcon,
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

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const isSubActive = data ? new Date(data.endDate).setHours(23, 59, 59, 999) >= startOfToday.getTime() : false;
  const statusConfig = STATUS_CONFIG[isSubActive ? 'active' : 'expired'];

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
                color={statusConfig.badgeStatus}
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

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 text-xs">Nguồn cấp:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${data.createdType === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                  {data.createdType === 'admin' ? 'Admin cấp' : 'Hệ thống'}
                </span>
              </div>
            </div>

            {/* Admin Manual Allocation & Proof Images Section */}
            {data.createdType === 'admin' && (data.notes || (data.proofUrls && Array.isArray(data.proofUrls) && data.proofUrls.length > 0)) && (
              <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3.5 mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-purple-700 text-xs font-bold">
                    <SparklesIcon className="h-4 w-4 text-purple-600" />
                    <span>Gói cấp thủ công bởi Admin</span>
                  </div>
                </div>

                {data.notes && (
                  <div className="text-xs text-purple-900">
                    <span className="font-medium text-slate-500 block mb-0.5">Ghi chú / Lý do cấp bù:</span>
                    <p className="p-2 text-slate-700 font-mono text-[11px] whitespace-pre-wrap">
                      {data.notes}
                    </p>
                  </div>
                )}

                {data.proofUrls && Array.isArray(data.proofUrls) && data.proofUrls.length > 0 && (
                  <div className="pt-2 border-t border-purple-200/60">
                    <span className="text-xs font-bold text-purple-900 block mb-2">
                      Ảnh minh chứng giao dịch
                    </span>
                    <Image.PreviewGroup>
                      <div className="flex gap-2.5 flex-wrap">
                        {data.proofUrls.map((url, i) => (
                          <div
                            key={i}
                            className="w-20 h-20 rounded-xl overflow-hidden border-2 border-purple-200 hover:border-purple-500 transition-all bg-white relative group"
                          >
                            <Image
                              src={url}
                              alt={`Minh chứng ${i + 1}`}
                              wrapperClassName="!w-full !h-full"
                              className="!w-full !h-full !object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default ModalDetail;
