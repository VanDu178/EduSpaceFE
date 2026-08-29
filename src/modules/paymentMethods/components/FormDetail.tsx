import { Drawer } from 'antd';
import CopyButton from '../../../components/CopyButton';
import PaymentMethodIcon from './PaymentMethodIcon';
import type { PaymentMethod } from '../types';
import { formatDate } from '../../../utils/format';

interface FormDetailProps {
  visible: boolean;
  data: PaymentMethod | null;
  onClose: () => void;
}

const FormDetail = ({ visible, data, onClose }: FormDetailProps) => {
  if (!data) return null;
  return (
    <Drawer title="Chi tiết" placement="right" width={420} onClose={onClose} open={visible}>
      <div className="space-y-4 text-sm text-slate-700">
        {/* Card thông tin chính */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
          <div>
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Mã</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="font-mono text-xs font-bold text-sky-600">{data.code}</span>
              <CopyButton text={data.code} tooltipText="Sao chép mã" successMessage="Đã sao chép mã!" />
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Tên</span>
            <span className="font-bold text-slate-800 text-sm">{data.name}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Trạng thái</span>
            <div className="mt-1">
              <span className={`font-bold text-xs ${data.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                {data.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
              </span>
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="space-y-4 pt-1">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Mô tả:</span>
            {data.description ? (
              <p className="text-slate-700 text-xs leading-relaxed">{data.description}</p>
            ) : (
              <span className="text-slate-400 text-xs italic">Không có mô tả</span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">Icon:</span>
              {data.icon ? (
                <div className="flex items-center space-x-1.5">
                  <PaymentMethodIcon iconName={data.icon} className="h-4 w-4 text-sky-600 shrink-0" />
                  <span className="font-mono text-xs text-slate-700 font-semibold truncate" title={data.icon}>
                    {data.icon}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 text-xs italic">Chưa xác định</span>
              )}
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">Thứ tự:</span>
              <span className="font-mono font-semibold text-slate-800 text-xs">{data.sortOrder}</span>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">Ngày tạo:</span>
              <span className="font-mono text-xs text-slate-700 font-medium block">
                {formatDate(data.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default FormDetail;
