import { Drawer, Descriptions, Image, Tooltip } from 'antd';
import { CheckCircleIcon, XCircleIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import type { VietqrBank } from '../types';

interface FormDetailProps {
  open: boolean;
  bank: VietqrBank | null;
  onClose: () => void;
}

const FormDetail = ({ open, bank, onClose }: FormDetailProps) => {
  if (!bank) return null;

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Chi tiết</span>}
      placement="right"
      width={480}
      open={open}
      onClose={onClose}
    >
      <div className="space-y-5">
        {/* Header card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-3">
          {bank.logo ? (
            <div className="p-2 bg-white rounded-xl border border-slate-200/80 h-16 w-32 flex items-center justify-center overflow-hidden">
              <Image src={bank.logo} alt={bank.shortName} height={48} className="max-h-12 max-w-full object-contain" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl">
              {bank.code}
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-slate-800">{bank.shortName}</h3>
            <p className="text-xs text-slate-500 max-w-xs">{bank.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full px-3 py-0.5 font-mono font-semibold text-xs bg-sky-100 text-sky-800">
              Mã: {bank.code}
            </span>
            <span className="rounded-full px-3 py-0.5 font-mono font-semibold text-xs bg-purple-100 text-purple-800">
              BIN: {bank.bin}
            </span>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <Descriptions title="Thông tin cấu hình hệ thống" column={1} bordered size="small" className="bg-white rounded-xl">
          <Descriptions.Item label="Tên ngắn gọn">
            <span className="font-semibold text-slate-800">{bank.shortName}</span>
          </Descriptions.Item>

          <Descriptions.Item label="Tên pháp nhân">
            <span className="text-slate-700">{bank.name}</span>
          </Descriptions.Item>

          <Descriptions.Item label="Mã ngân hàng">
            <span className="font-mono font-bold text-slate-800">{bank.code}</span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="inline-flex items-center gap-1.5">
                Mã BIN
                <Tooltip title="Mã định danh ngân hàng (Bank Identification Number) 6 chữ số theo chuẩn Napas, dùng để tạo mã VietQR Quick Link.">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 transition-colors cursor-help" />
                </Tooltip>
              </span>
            }
          >
            <span className="font-mono font-bold text-sky-600">{bank.bin}</span>
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="inline-flex items-center gap-1.5">
                Chuyển khoản QR 24/7
                <Tooltip title="Ngân hàng hỗ trợ nhận tiền tức thì 24/7 khi khách hàng quét mã QR chuẩn VietQR.">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 transition-colors cursor-help" />
                </Tooltip>
              </span>
            }
          >
            {bank.transferSupported === 1 ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <CheckCircleIcon className="h-4 w-4" /> Hỗ trợ VietQR 24/7
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                <XCircleIcon className="h-4 w-4" /> Không hỗ trợ
              </span>
            )}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="inline-flex items-center gap-1.5">
                Tra cứu tên chủ tài khoản
                <Tooltip title="Khả năng tự động tra cứu và hiển thị tên chủ tài khoản từ số tài khoản ngân hàng thông qua liên minh Napas/VietQR.">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 transition-colors cursor-help" />
                </Tooltip>
              </span>
            }
          >
            {bank.lookupSupported === 1 ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600">
                <CheckCircleIcon className="h-4 w-4" /> Hỗ trợ tự động qua VietQR/Napas
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                <XCircleIcon className="h-4 w-4" /> Nhập thủ công
              </span>
            )}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span className="inline-flex items-center gap-1.5">
                Trạng thái hệ thống
                <Tooltip title="Trạng thái cho phép hoặc tạm ngưng sử dụng ngân hàng này trong các tính năng tạo mã thanh toán trên TradeVerse.">
                  <QuestionMarkCircleIcon className="h-4 w-4 text-slate-400 hover:text-sky-600 transition-colors cursor-help" />
                </Tooltip>
              </span>
            }
          >
            <span className={`font-bold text-xs ${bank.isActive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {bank.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Drawer>
  );
};

export default FormDetail;
