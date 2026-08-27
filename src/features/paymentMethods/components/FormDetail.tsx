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
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Mã phương thức</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="font-mono text-xs font-bold text-sky-600">{data.code}</span>
              <CopyButton text={data.code} tooltipText="Sao chép mã" successMessage="Đã sao chép mã phương thức!" />
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Tên hiển thị</span>
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
        <div className="space-y-3.5 pt-2">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Mô tả:</span>
            {data.description ? (
              <p className="text-slate-700 text-xs leading-relaxed bg-white p-3 rounded-xl border border-slate-100">{data.description}</p>
            ) : (
              <span className="text-slate-400 text-xs italic">Không có mô tả</span>
            )}
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Icon:</span>
            {data.icon ? (
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-slate-100 w-fit">
                <PaymentMethodIcon iconName={data.icon} className="h-5 w-5 text-sky-600 shrink-0" />
                <span className="font-mono text-xs text-slate-700 font-semibold">{data.icon}</span>
              </div>
            ) : (
              <span className="text-slate-400 text-xs italic">Chưa xác định</span>
            )}
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">Thứ tự sắp xếp:</span>
            <span className="font-mono font-semibold text-slate-800 text-xs">{data.sortOrder}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">Ngày tạo:</span>
            <span className="font-mono text-xs text-slate-700 font-medium">
              {formatDate(data.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default FormDetail;
