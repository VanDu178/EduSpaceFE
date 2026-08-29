import { useEffect } from 'react';
import { Drawer, Form, Input, Select, Switch, Button } from 'antd';
import type { PaymentAccount, UpdatePaymentAccountDto } from '../types';
import type { VietqrBank } from '../../vietqrBanks/types';

interface FormUpdateProps {
  open: boolean;
  confirmLoading: boolean;
  banks: VietqrBank[];
  isBanksLoading?: boolean;
  data: PaymentAccount | null;
  onCancel: () => void;
  onSubmit: (values: UpdatePaymentAccountDto) => void;
}

const FormUpdate = ({
  open,
  confirmLoading,
  banks,
  isBanksLoading = false,
  data,
  onCancel,
  onSubmit,
}: FormUpdateProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && data) {
      form.setFieldsValue({
        bankCode: data.bankCode,
        accountNo: data.accountNo,
        accountHolder: data.accountHolder,
        note: data.note || '',
        isDefault: data.isDefault,
      });
    }
  }, [open, data, form]);

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      accountHolder: values.accountHolder?.toUpperCase(),
    });
  };

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Cập nhật</span>}
      placement="right"
      width={480}
      open={open}
      onClose={onCancel}
      footer={
        <div className="flex justify-end space-x-3 py-2 px-2">
          <Button onClick={onCancel} className="rounded-xl border-slate-200 text-sm font-medium">
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={confirmLoading}
            className="bg-amber-500 hover:bg-amber-600 border-none rounded-xl text-sm font-semibold py-1.5 px-4"
          >
            Cập nhật
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="space-y-4"
      >
        <Form.Item
          label={<span className="text-xs font-semibold text-slate-700">Ngân hàng thụ hưởng</span>}
          name="bankCode"
          rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}
        >
          <Select
            showSearch
            loading={isBanksLoading}
            placeholder="Chọn ngân hàng..."
            optionFilterProp="filterText"
            className="w-full rounded-xl"
            options={banks.map((b) => ({
              value: b.code,
              filterText: `${b.shortName} ${b.name}`,
              label: (
                <div className="flex items-center gap-2 py-0.5">
                  {b.logo ? (
                    <img src={b.logo} alt={b.shortName} className="h-5 w-auto object-contain max-w-[40px] shrink-0" />
                  ) : null}
                  <span className="font-semibold text-slate-800 text-xs">{b.shortName}</span>
                  <span className="font-mono text-[11px] text-slate-400 font-semibold">-</span>
                  <span className="text-slate-500 text-xs truncate max-w-[160px]">- {b.name}</span>
                </div>
              ),
            }))}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold text-slate-700">Số tài khoản</span>}
          name="accountNo"
          rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
        >
          <Input placeholder="Ví dụ: 0399998888" className="rounded-xl border-slate-200 font-mono text-sm py-2" />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold text-slate-700">Tên chủ tài khoản</span>}
          name="accountHolder"
          rules={[{ required: true, message: 'Vui lòng nhập tên chủ tài khoản' }]}
        >
          <Input placeholder="Ví dụ: CÔNG TY TNHH TRADEVERSE VIỆT NAM" className="rounded-xl border-slate-200 text-sm py-2 uppercase" />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-semibold text-slate-700">Ghi chú / Hướng dẫn</span>}
          name="note"
        >
          <Input.TextArea placeholder="Nhập ghi chú hoặc hướng dẫn chuyển khoản nếu có..." rows={3} className="rounded-xl border-slate-200 text-sm p-2" />
        </Form.Item>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <Form.Item name="isDefault" valuePropName="checked" className="mb-0" label={<span className="text-xs text-slate-600 font-medium">Đặt làm tài khoản nhận tiền chính</span>}>
            <Switch className="bg-slate-300" />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default FormUpdate;
