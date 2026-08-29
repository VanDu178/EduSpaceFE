import { Drawer, Button, Tag } from 'antd';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import type { PaymentAccount } from '../types';
import CopyButton from '../../../components/CopyButton';
import { StarIcon } from '@heroicons/react/16/solid';

interface FormDetailProps {
  open: boolean;
  data: PaymentAccount | null;
  onCancel: () => void;
}

const FormDetail = ({ open, data, onCancel }: FormDetailProps) => {
  if (!data) return null;

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Chi tiết</span>}
      placement="right"
      width={480}
      open={open}
      onClose={onCancel}
      footer={
        <div className="flex justify-end py-2 px-2">
          <Button onClick={onCancel} className="rounded-xl border-slate-200 text-sm font-medium">
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Realistic Bank Card Visual */}
        <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-5 text-white overflow-hidden border border-slate-800 flex flex-col justify-between select-none">
          {/* Subtle Background Accent Glare (Border & Gradient based) */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-indigo-500/10 pointer-events-none blur-xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-sky-500/10 pointer-events-none blur-xl" />

          {/* Top Bar: Bank Logo / Name & Wireless Symbol */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {data.bank?.logo ? (
                <div className="p-1.5 bg-white/95 rounded-lg border border-white/20 flex items-center justify-center max-w-[80px] h-8">
                  <img src={data.bank.logo} alt={data.bank.shortName} className="h-5 w-auto object-contain max-w-full" />
                </div>
              ) : (
                <div className="p-1.5 bg-white/10 rounded-lg flex items-center gap-1.5 border border-white/15">
                  <BanknotesIcon className="h-5 w-5 text-sky-400" />
                  <span className="font-bold text-xs tracking-wider uppercase text-white">{data.bankCode}</span>
                </div>
              )}

              {data.bank?.shortName && (
                <span className="font-semibold text-sm text-slate-200 tracking-wide truncate max-w-[150px]">
                  {data.bank.shortName}
                </span>
              )}
            </div>

            {/* Contactless Icon */}
            <svg className="w-6 h-6 text-slate-400/80 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 14.5a4.5 4.5 0 000-5M12 17.5a8.5 8.5 0 000-11M15.5 20.5a12.5 12.5 0 000-17" />
            </svg>
          </div>

          {/* Middle: EMV Chip & Default / Active Status Badges */}
          <div className="relative z-10 flex items-center justify-between my-auto pt-2">
            {/* Metallic Gold EMV Chip Visual */}
            <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 border border-amber-400/80 relative overflow-hidden flex flex-col justify-center px-1">
              <div className="absolute inset-[3px] border border-amber-600/40 rounded-[2px]" />
              <div className="w-full h-[1px] bg-amber-600/40 z-10" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-amber-600/40 z-10" />
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1.5">
              {data.isDefault && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30 tracking-wider uppercase">
                  Mặc định
                </span>
              )}
              {data.isActive ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 tracking-wider uppercase">
                  Hoạt động
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30 tracking-wider uppercase">
                  Vô hiệu hóa
                </span>
              )}
            </div>
          </div>

          {/* Bottom Area: Account Number & Account Holder */}
          <div className="relative z-10 space-y-2">
            {/* Account Number */}
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-lg sm:text-xl font-bold tracking-[0.18em] text-white">
                {data.accountNo}
              </div>
              <CopyButton text={data.accountNo} tooltipText="Sao chép số tài khoản" successMessage="Đã sao chép số tài khoản!" />
            </div>

            {/* Card Holder & Bank Code */}
            <div className="flex items-end justify-between gap-2 border-t border-white/10 pt-2">
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 block font-medium">Chủ tài khoản</span>
                <span className="font-semibold text-xs sm:text-sm text-slate-100 tracking-wider uppercase truncate block">
                  {data.accountHolder}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] uppercase tracking-widest text-slate-400 block font-medium">Mã ngân hàng</span>
                <span className="font-mono font-bold text-xs text-slate-200 tracking-wider">{data.bankCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Section */}
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-3 text-xs text-slate-700">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Ngân hàng:</span>
            <div className="flex items-center gap-1.5">
              {data.bank?.logo ? (
                <img src={data.bank.logo} alt={data.bank.shortName} className="h-4 w-auto object-contain max-w-[32px] shrink-0" />
              ) : (
                <BanknotesIcon className="h-4 w-4 text-sky-600 shrink-0" />
              )}
              <span className="font-semibold text-slate-800">{data.bank?.shortName || data.bankCode}</span>
              <Tag className="rounded-full px-2 py-0.5 text-[10px] font-bold !border-none bg-sky-100 text-sky-700">
                {data.bankCode}
              </Tag>
            </div>
          </div>

          {data.bank?.name ? (
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Tên đầy đủ:</span>
              <span className="font-medium text-slate-700 text-right truncate max-w-[260px]" title={data.bank.name}>
                {data.bank.name}
              </span>
            </div>
          ) : null}

          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Số tài khoản:</span>
            <div className="flex items-center gap-1">
              <span className="font-mono font-bold text-slate-800 text-sm">{data.accountNo}</span>
              <CopyButton text={data.accountNo} tooltipText="Sao chép số tài khoản" successMessage="Đã sao chép số tài khoản!" />
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Chủ tài khoản:</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-800 uppercase">{data.accountHolder}</span>
              <CopyButton text={data.accountHolder} tooltipText="Sao chép tên chủ tài khoản" successMessage="Đã sao chép tên chủ tài khoản!" />
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Tài khoản mặc định:</span>
            {data.isDefault ? (
              <span className="flex items-center gap-1 text-purple-700">
                <StarIcon className="h-4 w-4 text-purple-600 shrink-0" />
                <span className="text-xs font-semibold">Mặc định</span>
              </span>
            ) : (
              <span className="text-slate-400 text-xs italic">Không</span>
            )}
          </div>

          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Trạng thái:</span>
            {data.isActive ? (
              <span className="text-xs font-semibold !border-none text-emerald-700">
                Hoạt động
              </span>
            ) : (
              <span className="text-xs font-semibold !border-none text-slate-700">
                Vô hiệu hóa
              </span>
            )}
          </div>

          {data.qrCodeUrl ? (
            <div className="py-2 border-b border-slate-100 flex flex-col items-center gap-2">
              <span className="text-slate-500 font-medium self-start">Mã QR Thanh toán:</span>
              <div className="p-2 border border-slate-200 rounded-xl bg-slate-50">
                <img src={data.qrCodeUrl} alt="Mã QR" className="w-36 h-36 object-contain" />
              </div>
            </div>
          ) : null}

          <div className="py-2 space-y-1.5">
            <span className="text-slate-500 font-medium block">Ghi chú</span>
            <div className="">
              {data.note ? (
                <span className="text-slate-700 whitespace-pre-wrap">{data.note}</span>
              ) : (
                <span className="text-slate-400 text-xs italic">Chưa cập nhật</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default FormDetail;


