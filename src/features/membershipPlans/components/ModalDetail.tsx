import { Drawer, Button } from 'antd';
import type { MembershipPlan } from '../types';
import CopyButton from '../../../components/CopyButton';
import { formatCurrency } from '../../../utils/format';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface ModalDetailProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
}

const ModalDetail = ({ isOpen, onClose, plan }: ModalDetailProps) => {
  if (!plan) return null;

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const featuresList = Array.isArray(plan.features) ? plan.features : [];

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Chi tiết gói hội viên</span>}
      placement="right"
      width={560}
      open={isOpen}
      onClose={onClose}
      destroyOnClose
      footer={
        <div className="flex justify-end py-2 px-2">
          <Button onClick={onClose} className="rounded-xl px-5">
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-sm text-slate-700">
        {/* 1. THÔNG TIN QUẢN TRỊ TRÊN CÙNG */}
        <div className="pb-4 border-b border-slate-100 space-y-2.5">
          {/* Hàng 1: Mã gói, Trạng thái, Thứ tự */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Mã gói:</span>
              <span className="font-mono text-xs font-bold text-slate-800">{plan.code}</span>
              <CopyButton text={plan.code} tooltipText="Sao chép mã gói" successMessage="Đã sao chép mã gói!" />
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-400">Trạng thái:</span>
              <span className={`text-xs font-semibold ${plan.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {plan.isActive ? 'Kích hoạt' : 'Ẩn'}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-400">Thứ tự:</span>
              <strong className="text-xs text-slate-700 font-semibold">{plan.sortOrder ?? 0}</strong>
            </div>
          </div>

          {/* Hàng 2: Ngày tạo, Ngày cập nhật */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
            <span>Ngày tạo: <span className="text-slate-600 font-medium">{formatDate(plan.createdAt)}</span></span>
            <span>Ngày cập nhật: <span className="text-slate-600 font-medium">{formatDate(plan.updatedAt)}</span></span>
          </div>
        </div>

        {/* 2. CARD GÓI HỘI VIÊN PREVIEW (GOM BOX) */}
        <div className="bg-slate-50/50 border border-slate-200/70 rounded-2xl p-5 space-y-5">
          {/* Title & Tagline & Badge */}
          <div className="space-y-2">
            {plan.popularBadge && (
              <div>
                <span className="inline-block bg-sky-50 text-sky-600 font-bold text-xs px-3 py-1 rounded-full">
                  {plan.popularBadge}
                </span>
              </div>
            )}
            <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
            {plan.tagLine && (
              <p className="text-xs text-slate-500 leading-relaxed">{plan.tagLine}</p>
            )}
          </div>

          {/* Pricing - Seamless format */}
          <div className="space-y-1.5 py-4 border-y border-slate-200/60">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900">{formatCurrency(plan.monthlyPrice)}</span>
              <span className="text-xs text-slate-400 font-medium">/ tháng</span>
            </div>
            <div className="text-xs text-slate-500">
              Hoặc thanh toán theo năm: <strong className="text-sky-600 font-bold">{formatCurrency(plan.yearlyPrice)}</strong> / năm
            </div>
          </div>

          {/* CTA Button */}
          <div>
            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold text-sm text-center border-none cursor-pointer"
            >
              {plan.buttonText || 'Đăng ký ngay'}
            </button>
          </div>

          {/* Features List */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Quyền lợi bao gồm:</h4>
            {featuresList.length > 0 ? (
              <ul className="space-y-2.5">
                {featuresList.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2 text-xs text-slate-700">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa có quyền lợi nào được thiết lập.</p>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default ModalDetail;
