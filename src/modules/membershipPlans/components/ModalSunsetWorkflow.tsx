import { useState } from 'react';
import { Modal, Form, InputNumber, DatePicker, Input, Radio } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { CalendarIcon, GiftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface SunsetConfigResult {
  disabledAt: string | null;
  compensateDays: number;
  notifyReason: string;
}

interface ModalSunsetWorkflowProps {
  open: boolean;
  featureName?: string;
  subscriberCount?: number;
  onCancel: () => void;
  onConfirm: (result: SunsetConfigResult) => void;
}

const ModalSunsetWorkflow = ({
  open,
  featureName,
  subscriberCount = 0,
  onCancel,
  onConfirm,
}: ModalSunsetWorkflowProps) => {
  const [form] = Form.useForm();
  const [mode, setMode] = useState<'days' | 'date'>('days');


  const handleDaysChange = (value: number | null) => {
    if (value && value > 0) {
      form.setFieldsValue({
        customDate: dayjs().add(value, 'day'),
      });
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const diff = date.diff(dayjs(), 'day');
      form.setFieldsValue({
        customDays: diff > 0 ? diff : 1,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      let disabledAtStr: string | null = null;

      if (mode === 'days' && values.customDays) {
        disabledAtStr = dayjs().add(values.customDays, 'day').toISOString();
      } else if (mode === 'date' && values.customDate) {
        disabledAtStr = (values.customDate as Dayjs).toISOString();
      }

      onConfirm({
        disabledAt: disabledAtStr,
        compensateDays: values.compensateDays || 0,
        notifyReason: values.notifyReason || '',
      });
    } catch {
      // Validation error
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center space-x-2 text-slate-800">
          <span className="font-semibold text-base">Cấu hình ngưng tính năng</span>
        </div>
      }
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Xác nhận"
      cancelText="Hủy"
      okButtonProps={{ className: 'bg-sky-500 hover:bg-sky-600 border-none rounded-xl' }}
      cancelButtonProps={{ className: 'rounded-xl border-slate-200' }}
      className="rounded-2xl overflow-hidden"
      width={520}
    >
      <div className="my-3 p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800">
        Tính năng <span className="font-bold">{featureName || 'này'}</span> đang được{' '}
        <span className="font-bold">{subscriberCount}</span> tài khoản sử dụng. Vui lòng thiết lập thời gian hẹn tắt và ưu đãi đền bù.
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          mode: 'days',
          customDays: 7,
          customDate: dayjs().add(7, 'day'),
          compensateDays: 0,
          notifyReason: 'Tính năng này tạm thời ngưng cung cấp để nâng cấp chất lượng dịch vụ.',
        }}
      >
        {/* Phần 1: Chọn mốc thời gian hẹn tắt */}
        <Form.Item
          label={
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4 text-sky-600" />
              <span>Thời gian hẹn tắt tính năng</span>
            </div>
          }
          className="mb-4">
          <Radio.Group
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mb-2"
          >
            <Radio value="days">Nhập số ngày</Radio>
            <Radio value="date">Chọn ngày cụ thể</Radio>
          </Radio.Group>

          {mode === 'days' ? (
            <Form.Item name="customDays" noStyle rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}>
              <InputNumber
                min={1}
                max={365}
                className="w-full rounded-xl py-1 text-sm border-slate-200"
                placeholder="Nhập số ngày hẹn tắt (vd: 7, 10, 15...)"
                addonAfter="ngày nữa"
                onChange={handleDaysChange}
              />
            </Form.Item>
          ) : (
            <Form.Item name="customDate" noStyle rules={[{ required: true, message: 'Vui lòng chọn ngày cụ thể' }]}>
              <DatePicker
                showTime
                format="DD/MM/YYYY HH:mm"
                className="w-full rounded-xl py-1 text-sm border-slate-200"
                placeholder="Chọn ngày giờ chính xác"
                onChange={handleDateChange}
              />
            </Form.Item>
          )}
        </Form.Item>

        {/* Phần 2: Số ngày đền bù */}
        <Form.Item
          name="compensateDays"
          label={
            <div className="flex items-center space-x-1">
              <GiftIcon className="h-4 w-4 text-emerald-600" />
              <span>Số ngày đền bù cộng thêm cho tài khoản active</span>
            </div>
          }
          className="mb-4"
        >
          <InputNumber
            min={0}
            max={365}
            className="w-full rounded-xl py-1 text-sm border-slate-200"
            placeholder="Nhập số ngày đền bù (0 nếu không đền bù)"
            addonAfter="ngày"
          />
        </Form.Item>

        {/* Phần 3: Nội dung Email thông báo */}
        <Form.Item
          name="notifyReason"
          label={
            <div className="flex items-center space-x-1">
              <EnvelopeIcon className="h-4 w-4 text-sky-600" />
              <span>Nội dung Email thông báo gửi người dùng</span>
            </div>
          }
          className="mb-2"
        >
          <Input.TextArea
            rows={3}
            className="rounded-xl text-sm border-slate-200"
            placeholder="Nhập nội dung Email thông báo gửi tới người dùng..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalSunsetWorkflow;
