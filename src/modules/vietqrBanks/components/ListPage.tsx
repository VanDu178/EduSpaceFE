import { Table, Button, Tooltip, Empty, Switch, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { VietqrBank } from '../types';
import CopyButton from '../../../components/CopyButton';

interface ListPageProps {
  banks: VietqrBank[];
  isLoading: boolean;
  onViewDetail: (bank: VietqrBank) => void;
  onToggleStatus: (bank: VietqrBank) => void;
}

const ListPage = ({
  banks,
  isLoading,
  onViewDetail,
  onToggleStatus,
}: ListPageProps) => {
  if (!isLoading && banks.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Không có dữ liệu ngân hàng VietQR" />
      </div>
    );
  }

  const columns: ColumnsType<VietqrBank> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      width: 130,
      align: 'center',
      fixed: 'left',
      render: (text: string, record: VietqrBank) => (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onViewDetail(record)}
            className="font-mono text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer bg-transparent border-none p-0"
            title="Click xem chi tiết"
          >
            {text}
          </button>
          <CopyButton text={text} tooltipText="Sao chép mã ngân hàng" successMessage="Đã sao chép mã ngân hàng!" />
        </div>
      ),
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 90,
      align: 'center',
      render: (logoUrl: string | null, record: VietqrBank) => (
        <div className="flex items-center justify-center p-1 bg-white rounded-lg border border-slate-100 h-10 w-16 mx-auto overflow-hidden">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={record.shortName}
              height={32}
              className="max-h-8 max-w-full object-contain"
              preview={{
                mask: <EyeIcon className="h-4 w-4 text-white" />,
              }}
            />
          ) : (
            <span className="text-[10px] font-bold text-slate-400 italic">N/A</span>
          )}
        </div>
      ),
    },
    {
      title: 'Ngân hàng',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 240,
      render: (text: string, record: VietqrBank) => (
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-bold text-slate-800 text-xs truncate" title={text}>
              {text}
            </span>
            <span className="text-[11px] text-slate-500 truncate max-w-xs" title={record.name}>
              {record.name}
            </span>
          </div>
          <CopyButton
            text={`${text} - ${record.name}`}
            tooltipText="Sao chép tên ngân hàng"
            successMessage="Đã sao chép tên ngân hàng!"
          />
        </div>
      ),
    },
    {
      title: 'Mã BIN',
      dataIndex: 'bin',
      key: 'bin',
      width: 130,
      align: 'center',
      render: (text: string) => (
        <div className="flex items-center justify-center gap-1">
          <span className="font-mono font-semibold text-xs text-sky-700">
            {text}
          </span>
          <CopyButton text={text} tooltipText="Sao chép mã BIN" successMessage="Đã sao chép mã BIN!" />
        </div>
      ),
    },
    {
      title: 'Chuyển tiền QR',
      dataIndex: 'transferSupported',
      key: 'transferSupported',
      width: 140,
      align: 'center',
      render: (transferSupported: number) => (
        <div className="inline-flex items-center gap-1.5 justify-center">
          {transferSupported === 1 ? (
            <>
              <CheckCircleIcon className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-emerald-600 text-xs">Hỗ trợ 24/7</span>
            </>
          ) : (
            <>
              <XCircleIcon className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-400 text-xs">Không</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Tra cứu tên',
      dataIndex: 'lookupSupported',
      key: 'lookupSupported',
      width: 140,
      align: 'center',
      render: (lookupSupported: number) => (
        <div className="inline-flex items-center gap-1.5 justify-center">
          {lookupSupported === 1 ? (
            <>
              <CheckCircleIcon className="h-4 w-4 text-purple-600 shrink-0" />
              <span className="font-semibold text-purple-600 text-xs">Hỗ trợ tự động</span>
            </>
          ) : (
            <>
              <XCircleIcon className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-400 text-xs">Thủ công</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      width: 160,
      render: (isActive: boolean, record: VietqrBank) => (
        <div className="flex items-center justify-center gap-2">
          <Tooltip title={isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}>
            <Switch
              size="small"
              checked={isActive}
              onChange={() => onToggleStatus(record)}
            />
          </Tooltip>
          <span className={`font-bold text-xs ${isActive ? 'text-emerald-600' : 'text-slate-600'}`}>
            {isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
          </span>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 90,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <div className="flex items-center justify-center">
          {/* Xem chi tiết */}
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              onClick={() => onViewDetail(record)}
              icon={<EyeIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden flex flex-col flex-1">
      <Table
        columns={columns}
        dataSource={banks}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 'max-content', y: 'calc(100vh - 327px)' }}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 20,
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
