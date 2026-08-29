import { Drawer, Button, Tag } from 'antd';
import type { Feature } from '../types';
import CopyButton from '../../../components/CopyButton';
import { formatDate } from '../../../utils/format';

interface ModalDetailProps {
  isOpen: boolean;
  onClose: () => void;
  feature: Feature | null;
}

const ModalDetail = ({ isOpen, onClose, feature }: ModalDetailProps) => {
  if (!feature) return null;

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Chi tiết</span>}
      placement="right"
      width={480}
      open={isOpen}
      onClose={onClose}
      footer={
        <div className="flex justify-end py-2 px-2">
          <Button onClick={onClose} className="rounded-xl px-5">
            Đóng
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-sm text-slate-700">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <Tag color="blue" className="text-xs font-mono font-bold px-2.5 py-1 rounded-md !border-none">
              {feature?.code}
            </Tag>
            <CopyButton text={feature?.code || ''} tooltipText="Sao chép mã tính năng" successMessage="Đã sao chép mã!" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{feature?.name}</h3>
            {feature?.description ? (
              <p className="text-xs text-slate-500 leading-relaxed mt-1">{feature?.description}</p>
            ) : (
              <p className="text-xs text-slate-400 italic mt-1">Chưa có mô tả.</p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200/60 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Thứ tự sắp xếp:</span>
              <span className="font-semibold text-slate-700">{feature.sortOrder ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Trạng thái:</span>
              <span
                className={`font-bold px-2.5 py-1 rounded-full text-xs ${feature.isActive
                  ? 'text-emerald-700'
                  : 'text-slate-600'
                  }`}
              >
                {feature.isActive ? 'Đang kích hoạt' : 'Đang tắt'}
              </span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Ngày tạo:</span>
              <span className="text-slate-600 font-medium">{formatDate(feature.createdAt, false)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cập nhật lần cuối:</span>
              <span className="text-slate-600 font-medium">{formatDate(feature.updatedAt, false)}</span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default ModalDetail;
