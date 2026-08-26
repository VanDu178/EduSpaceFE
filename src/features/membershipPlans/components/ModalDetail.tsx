import { Drawer, Button } from 'antd';
import type { MembershipPlan } from '../types';
import CopyButton from '../../../components/CopyButton';
import { formatCurrency, formatDate } from '../../../utils/format';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ModalDetailProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
}

const ModalDetail = ({ isOpen, onClose, plan }: ModalDetailProps) => {
  if (!plan) return null;

  const planFeatures = plan.planFeatures || [];
  const availableFeatures = planFeatures.filter((pf) => pf.isAvailable);
  const unavailableFeatures = planFeatures.filter((pf) => !pf.isAvailable);

  const featuresList = availableFeatures.map((pf) => ({
    name: pf.feature?.name || 'Tính năng',
    code: pf.feature?.code
  }));

  const unavailableFeaturesList = unavailableFeatures.map((pf) => ({
    name: pf.feature?.name || 'Tính năng',
    code: pf.feature?.code
  }));

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Chi tiết</span>}
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
          {/* Hàng 1: Mã gói, Trạng thái, Cấp độ */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Mã:</span>
              <span className="font-mono text-xs font-bold text-slate-800">{plan.code}</span>
              <CopyButton text={plan.code} tooltipText="Sao chép mã gói" successMessage="Đã sao chép mã gói!" />
            </div>

            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-400">Cấp độ gói:</span>
              <span className="text-xs font-bold text-purple-700">
                Tier {plan.tierLevel ?? 1}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-400">Trạng thái:</span>
              <span className={`text-xs font-semibold ${plan.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                {plan.isActive ? 'Kích hoạt' : 'Ẩn'}
              </span>
            </div>
          </div>

          {/* Hàng 2: Ngày tạo, Ngày cập nhật */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
            <span>Ngày tạo: <span className="text-slate-600 font-medium">{formatDate(plan.createdAt, false, '—')}</span></span>
            <span>Ngày cập nhật: <span className="text-slate-600 font-medium">{formatDate(plan.updatedAt, false, '—')}</span></span>
          </div>
        </div>

        {/* 2. CARD GÓI HỘI VIÊN PREVIEW */}
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
            <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
            {plan.tagLine && (
              <p className="text-xs text-slate-500 leading-relaxed">{plan.tagLine}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="space-y-1.5 py-4 border-y border-slate-200/60">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-slate-900">{formatCurrency(plan.monthlyPrice)}</span>
              <span className="text-xs text-slate-400 font-medium">/ tháng</span>
            </div>
            <div className="text-xs text-slate-500">
              Hoặc thanh toán theo năm: <strong className="text-sky-600 font-bold">{formatCurrency(plan.yearlyPrice)}</strong> / năm
              {Number(plan.yearlyDiscountPercent) > 0 && (
                <span className="ml-2 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
                  Tiết kiệm {plan.yearlyDiscountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <div>
            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold text-sm text-center border-none"
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
                  <li key={index} className="flex items-center space-x-2 text-xs text-slate-700">
                    <CheckCircleIcon className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="leading-relaxed font-medium">{item.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa có quyền lợi nào được thiết lập.</p>
            )}
          </div>

          {/* Unavailable Features List */}
          {unavailableFeaturesList.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-200/60">
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Chưa hỗ trợ:</h4>
              <ul className="space-y-2.5">
                {unavailableFeaturesList.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2 text-xs text-slate-400">
                    <XMarkIcon className="h-4 w-4 text-rose-400 shrink-0" />
                    <span className="leading-relaxed line-through decoration-slate-300">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ModalDetail;
