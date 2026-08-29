import { Modal, Button } from 'antd';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export interface ResetSuccessData {
  email: string;
  newPassword: string;
  loginUrl?: string;
}

interface ModalResetSuccessProps {
  data: ResetSuccessData | null;
  onClose: () => void;
}

const ModalResetSuccess = ({ data, onClose }: ModalResetSuccessProps) => {
  const handleCopyAll = () => {
    if (!data) return;
    const copyContent = `Email: ${data.email}\nMật khẩu: ${data.newPassword}`;
    navigator.clipboard.writeText(copyContent);
    toast.success('Đã sao chép thông tin đăng nhập!');
  };

  return (
    <Modal
      open={!!data}
      title={<span className="text-lg font-bold text-slate-800">Đặt lại mật khẩu thành công</span>}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          type="primary"
          onClick={onClose}
          className="rounded-lg bg-sky-600 hover:bg-sky-700 font-semibold border-none"
        >
          Đóng
        </Button>
      ]}
      className="max-w-md"
    >
      <div className="pt-2 space-y-4">
        {/* Khối Thông tin đăng nhập */}
        <div className="bg-slate-50 p-3.5 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin đăng nhập</span>
            <Button
              type="text"
              size="small"
              onClick={handleCopyAll}
              icon={<DocumentDuplicateIcon className="w-4 h-4 text-sky-600" />}
              className="text-sky-600 hover:text-sky-700 font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              Sao chép
            </Button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="text-xs text-slate-500 font-medium">Email: {" "}</span>
              <span className="font-semibold text-slate-800 select-all">{data?.email}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-slate-500 font-medium">Mật khẩu: {" "}</span>
              <span className="font-semibold text-slate-800 select-all">{data?.newPassword}</span>
            </div>
          </div>
        </div>

        {/* Dòng câu lưu ý bên dưới cùng */}
        <p className="text-xs text-slate-500 italic">
          Lưu ý: Thông tin đăng nhập đã được gửi thông qua email đăng ký của bạn.
        </p>
      </div>
    </Modal>
  );
};

export default ModalResetSuccess;
