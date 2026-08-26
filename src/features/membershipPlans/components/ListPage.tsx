import { Table, Switch, Tag, Popconfirm, Button, Tooltip, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MembershipPlan } from '../types';
import CopyButton from '../../../components/CopyButton';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../../utils/format';

interface ListPageProps {
  plans: MembershipPlan[];
  isLoading: boolean;
  onViewDetail: (plan: MembershipPlan) => void;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const ListPage = ({
  plans,
  isLoading,
  onViewDetail,
  onEdit,
  onDelete,
  onToggleStatus,
  pagination,
}: ListPageProps) => {
  if (!isLoading && plans.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center flex-1">
        <Empty description="Không có gói hội viên nào" />
      </div>
    );
  }

  const columns: ColumnsType<MembershipPlan> = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      fixed: "left",
      render: (code: string, record: MembershipPlan) => (
        <div className="flex items-center space-x-1 font-mono text-xs text-slate-700 w-fit">
          <button
            type="button"
            onClick={() => onViewDetail(record)}
            className="font-semibold hover:text-sky-600 hover:underline cursor-pointer border-none bg-transparent p-0 text-left font-mono text-xs text-slate-700 font-medium"
            title="Xem chi tiết"
          >
            {code}
          </button>
          <CopyButton text={code} tooltipText="Sao chép mã gói" successMessage="Đã sao chép mã gói!" />
        </div>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name: string, record: MembershipPlan) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 text-sm">{name}</span>
          {record.tagLine && (
            <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">{record.tagLine}</span>
          )}
        </div>
      ),
    },
    {
      title: 'Giá theo tháng',
      dataIndex: 'monthlyPrice',
      key: 'monthlyPrice',
      width: 130,
      align: 'left',
      render: (price: number) => (
        <span className="font-medium text-slate-800 text-sm">{formatCurrency(price)}</span>
      ),
    },
    {
      title: 'Giá theo năm',
      dataIndex: 'yearlyPrice',
      key: 'yearlyPrice',
      width: 130,
      align: 'left',
      render: (price: number) => (
        <span className="font-medium text-slate-800 text-sm">{formatCurrency(price)}</span>
      ),
    },
    {
      title: '% Giảm năm',
      dataIndex: 'yearlyDiscountPercent',
      key: 'yearlyDiscountPercent',
      width: 110,
      align: 'center',
      render: (percent: number) =>
        percent > 0 ? (
          <span className="text-red-600 font-semibold text-xs">
            -{percent}%
          </span>
        ) : (
          <span className="text-slate-400 text-xs">0%</span>
        ),
    },
    {
      title: 'Nhãn nổi bật',
      dataIndex: 'popularBadge',
      key: 'popularBadge',
      width: 130,
      render: (badge: string | null) =>
        badge ? (
          <Tag color="cyan" className="rounded-full px-3 py-0.5 !border-none font-medium">
            {badge}
          </Tag>
        ) : (
          <span className="text-slate-400 text-xs italic">Không có nhãn</span>
        ),
    },
    {
      title: "Tên nút bấm (CTA)",
      dataIndex: "buttonText",
      key: "buttonText",
      width: 150,
      align: "left",
      render: (buttonText: string) => (
        <span className="font-medium text-slate-800 text-sm">{buttonText}</span>
      ),
    },
    {
      title: 'Cấp độ gói',
      dataIndex: 'tierLevel',
      key: 'tierLevel',
      width: 100,
      align: 'center',
      render: (tierLevel: number) => (
        <span className="text-violet-600 font-semibold text-xs">
          Tier {tierLevel ?? 1}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: "left",
      render: (isActive: boolean, record: MembershipPlan) => (
        <div className="flex items-center !space-x-2">
          <Switch
            checked={isActive}
            onChange={() => onToggleStatus(record.id)}
            size="small"
            className={isActive ? 'bg-sky-500' : 'bg-slate-300'}
          />
          <span className={`text-xs font-medium ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
            {isActive ? 'Kích hoạt' : 'Ẩn'}
          </span>
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 130,
      align: 'center',
      fixed: "right",
      render: (_: any, record: MembershipPlan) => (
        <div className="flex items-center justify-center space-x-1">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              onClick={() => onViewDetail(record)}
              icon={<EyeIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              onClick={() => onEdit(record)}
              icon={<PencilSquareIcon className="h-4 w-4 text-slate-500 hover:text-sky-600 transition-colors" />}
              className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Popconfirm
              title="Xóa gói hội viên"
              description="Bạn có chắc chắn muốn xóa gói hội viên này không?"
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true, className: 'rounded-lg' }}
              cancelButtonProps={{ className: 'rounded-lg' }}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<TrashIcon className="h-4 w-4 text-rose-500 hover:text-rose-700 transition-colors" />}
                className="p-1 hover:bg-rose-50 rounded-lg flex items-center justify-center"
              />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-hidden flex flex-col flex-1">
      <Table
        columns={columns}
        dataSource={plans}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 'max-content', y: 'calc(100vh - 386px)' }}
        pagination={
          pagination
            ? {
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: pagination.onChange,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total) => `Tổng cộng: ${total} dòng dữ liệu`,
              style: { marginBottom: 0 },
            }
            : {
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '50'],
              showTotal: (total) => `Tổng cộng: ${total} dòng dữ liệu`,
              style: { marginBottom: 0 },
            }
        }
        className="w-full"
        rowClassName="hover:bg-slate-50/50 transition-colors"
      />
    </div>
  );
};

export default ListPage;
