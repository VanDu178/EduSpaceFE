import { Table, Button, Tooltip, Empty, Switch, Popconfirm, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import type { PaymentAccount } from '../types';
import type { VietqrBank } from '../../vietqrBanks/types';
import CopyButton from '../../../components/CopyButton';

interface ListPageProps {
  paymentAccounts: PaymentAccount[];
  isLoading: boolean;
  banks?: VietqrBank[];
  onViewDetail: (account: PaymentAccount) => void;
  onEdit: (account: PaymentAccount) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (account: PaymentAccount) => void;
  onSetDefault: (account: PaymentAccount) => void;
}

const ListPage = ({
  paymentAccounts,
  isLoading,
  banks = [],
  onViewDetail,
  onEdit,
  onDelete,
  onToggleStatus,
  onSetDefault,
}: ListPageProps) => {
  const getBankInfo = (record: PaymentAccount) => {
    const bankObj =
      record.bank ||
      banks.find((b) => b.code.toLowerCase() === record.bankCode.toLowerCase());

    const shortName = bankObj?.shortName || record.bankCode;
    const fullName = bankObj?.name;
    const logo = bankObj?.logo;

    return { shortName, fullName, logo };
  };

  if (!isLoading && paymentAccounts.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Không có dữ liệu tài khoản thanh toán" />
      </div>
    );
  }

  const columns: ColumnsType<PaymentAccount> = [
    {
      title: 'Số tài khoản',
      dataIndex: 'accountNo',
      key: 'accountNo',
      width: 170,
      align: 'left',
      fixed: 'left',
      render: (text: string, record: PaymentAccount) => (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onViewDetail(record)}
            className="font-mono text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer bg-transparent border-none p-0"
            title="Click xem chi tiết"
          >
            {text}
          </button>
          <CopyButton text={text} tooltipText="Sao chép số tài khoản" successMessage="Đã sao chép số tài khoản!" />
        </div>
      ),
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'bankCode',
      key: 'bankCode',
      width: 250,
      render: (_: any, record: PaymentAccount) => {
        const { shortName, fullName, logo } = getBankInfo(record);
        return (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {logo ? (
                <Image src={logo} alt={shortName} className="h-5 w-auto object-contain max-w-[36px] shrink-0" />
              ) : null}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-bold text-slate-800 text-xs truncate" title={shortName}>
                  {shortName}
                </span>
                {fullName ? (
                  <span className="text-[11px] text-slate-500 truncate" title={fullName}>
                    {fullName}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Chưa cập nhật tên</span>
                )}
              </div>
            </div>
            <CopyButton
              text={fullName ? `${shortName} - ${fullName}` : shortName}
              tooltipText="Sao chép thông tin ngân hàng"
              successMessage="Đã sao chép thông tin ngân hàng!"
            />
          </div>
        );
      },
    },
    {
      title: 'Chủ tài khoản',
      dataIndex: 'accountHolder',
      key: 'accountHolder',
      width: 220,
      render: (text: string) => (
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-slate-800 text-xs uppercase truncate" title={text}>
            {text}
          </span>
          <CopyButton text={text} tooltipText="Sao chép tên chủ tài khoản" successMessage="Đã sao chép tên chủ tài khoản!" />
        </div>
      ),
    },
    {
      title: 'Mặc định',
      dataIndex: 'isDefault',
      key: 'isDefault',
      align: 'center',
      width: 150,
      render: (isDefault: boolean, record: PaymentAccount) => (
        <div className="flex items-center justify-center gap-2">
          <Tooltip title={isDefault ? 'Tắt mặc định' : 'Đặt làm mặc định'}>
            <Switch
              size="small"
              checked={isDefault}
              onChange={() => onSetDefault(record)}
            />
          </Tooltip>
          <span className={`text-xs ${isDefault ? 'font-semibold text-purple-700' : 'font-semibold text-slate-400'}`}>
            {isDefault ? 'Mặc định' : 'Tài khoản phụ'}
          </span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'left',
      width: 160,
      render: (isActive: boolean, record: PaymentAccount) => (
        <div className="flex items-center gap-2">
          <Tooltip title={isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}>
            <Switch
              size="small"
              checked={isActive}
              onChange={() => onToggleStatus(record)}
            />
          </Tooltip>
          <span className={`font-bold text-xs ${isActive ? 'text-emerald-600' : "text-slate-400"}`}>
            {isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
          </span>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-center space-x-1">
          {/* Icon Xem chi tiết */}
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              onClick={() => onViewDetail(record)}
              icon={<EyeIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          {/* Icon Cập nhật */}
          <Tooltip title="Cập nhật">
            <Button
              type="text"
              size="small"
              onClick={() => onEdit(record)}
              icon={<PencilSquareIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          {/* Icon Xóa */}
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa bản ghi này?"
            onConfirm={() => onDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, className: 'rounded-lg text-xs' }}
            cancelButtonProps={{ className: 'rounded-lg text-xs' }}
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                size="small"
                icon={<TrashIcon className="h-4 w-4 text-slate-500 hover:text-rose-600 transition-colors" />}
                className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden flex flex-col flex-1">
      <Table
        columns={columns}
        dataSource={paymentAccounts}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 'max-content', y: 'calc(100vh - 316px)' }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Tổng cộng: ${total} dòng dữ liệu`,
          style: { marginBottom: 0 },
        }}
        className="w-full"
        rowClassName="hover:bg-slate-50/50 transition-colors"
      />
    </div>
  );
};

export default ListPage;


