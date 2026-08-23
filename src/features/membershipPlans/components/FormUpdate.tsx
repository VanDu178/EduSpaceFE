import { useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Select, Switch, Button } from 'antd';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { MembershipPlan, MembershipPlanPayload } from '../types';
import { BADGE_OPTIONS } from '../constants';

interface FormUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: MembershipPlanPayload) => void;
  isLoading: boolean;
  plan: MembershipPlan | null;
}

const FormUpdate = ({ isOpen, onClose, onSave, isLoading, plan }: FormUpdateProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen && plan) {
      const parsedFeatures = Array.isArray(plan.features) ? plan.features : [];
      const parsedUnavailableFeatures = Array.isArray(plan.unavailableFeatures) ? plan.unavailableFeatures : [];

      form.setFieldsValue({
        name: plan.name,
        tagLine: plan.tagLine || '',
        monthlyPrice: Number(plan.monthlyPrice) || 0,
        yearlyPrice: Number(plan.yearlyPrice) || 0,
        popularBadge: plan.popularBadge || '',
        buttonText: plan.buttonText || '',
        sortOrder: plan.sortOrder || 0,
        isActive: plan.isActive,
        features: parsedFeatures,
        unavailableFeatures: parsedUnavailableFeatures,
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, plan, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const cleanedFeatures = Array.isArray(values.features)
        ? values.features.map((f: string) => f?.trim()).filter(Boolean)
        : [];
      const cleanedUnavailableFeatures = Array.isArray(values.unavailableFeatures)
        ? values.unavailableFeatures.map((f: string) => f?.trim()).filter(Boolean)
        : [];

      onSave({
        ...values,
        features: cleanedFeatures.length > 0 ? cleanedFeatures : null,
        unavailableFeatures: cleanedUnavailableFeatures.length > 0 ? cleanedUnavailableFeatures : null,
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Cập nhật</span>}
      placement="right"
      width={560}
      open={isOpen}
      onClose={onClose}
      destroyOnClose
      footer={
        <div className="flex justify-end space-x-3 py-2 px-2">
          <Button onClick={onClose} className="rounded-xl">
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}
            className="bg-sky-500 hover:bg-sky-600 border-none rounded-xl font-medium"
          >
            Cập nhật
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        className="space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            name="name"
            label={<span className="font-semibold text-slate-700">Tên gói</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            className="md:col-span-2"
          >
            <Input placeholder="Ví dụ: Gói Pro, Gói VIP..." className="rounded-xl py-2" />
          </Form.Item>

          <Form.Item
            name="tagLine"
            label={<span className="font-semibold text-slate-700">Khẩu hiệu / Tagline</span>}
            className="md:col-span-2"
          >
            <Input.TextArea
              rows={2}
              placeholder="Ví dụ: Dành cho cá nhân muốn nâng cao trình độ"
              className="rounded-xl py-2"
            />
          </Form.Item>

          <Form.Item
            name="monthlyPrice"
            label={<span className="font-semibold text-slate-700">Giá theo tháng</span>}
            rules={[{ required: true, message: 'Vui lòng nhập giá tháng!' }]}
          >
            <InputNumber<number | string>
              min={0}
              step={10000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
              className="w-full rounded-xl"
              addonAfter="VND"
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="yearlyPrice"
            label={<span className="font-semibold text-slate-700">Giá theo năm</span>}
            rules={[{ required: true, message: 'Vui lòng nhập giá năm!' }]}
          >
            <InputNumber<number | string>
              min={0}
              step={100000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
              className="w-full rounded-xl"
              addonAfter="VND"
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="popularBadge"
            label={<span className="font-semibold text-slate-700">Nhãn nổi bật</span>}
          >
            <Select
              allowClear
              placeholder="Chọn hoặc nhập nhãn"
              options={BADGE_OPTIONS}
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="buttonText"
            label={<span className="font-semibold text-slate-700">Tên nút bấm (CTA)</span>}
          >
            <Input placeholder="Ví dụ: Đăng ký ngay, Bắt đầu thử nghiệm..." className="rounded-xl py-2" />
          </Form.Item>

          <Form.Item
            name="sortOrder"
            label={<span className="font-semibold text-slate-700">Thứ tự hiển thị</span>}
          >
            <InputNumber min={0} className="w-full rounded-xl py-0.5" />
          </Form.Item>

          <Form.Item
            name="isActive"
            valuePropName="checked"
            label={<span className="font-semibold text-slate-700">Trạng thái kích hoạt</span>}
          >
            <Switch className="bg-slate-300" />
          </Form.Item>
        </div>

        {/* Dynamic list features */}
        <div className="border-t border-slate-100 pt-3">
          <label className="block font-semibold text-slate-700 mb-2">Danh sách quyền lợi</label>
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <div className="space-y-2">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex !items-start space-x-2">
                    <Form.Item
                      {...restField}
                      name={[name]}
                      className="flex-1 mb-0"
                    >
                      <Input placeholder="Nhập quyền lợi..." className="rounded-xl py-1.5" />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      onClick={() => remove(name)}
                      icon={<TrashIcon className="h-4 w-4" />}
                      className="w-9 h-9 hover:bg-rose-50 rounded-lg flex items-center justify-center shrink-0"
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add('')}
                  block
                  icon={<PlusIcon className="h-4 w-4 inline" />}
                  className="rounded-xl mt-2 border-slate-300 text-slate-600 hover:text-sky-600 hover:border-sky-400"
                >
                  Thêm quyền lợi
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        {/* Dynamic list unavailable features */}
        <div className="border-t border-slate-100 pt-3">
          <label className="block font-semibold text-slate-700 mb-2">Tính năng chưa tiếp cận (bị giới hạn)</label>
          <Form.List name="unavailableFeatures">
            {(fields, { add, remove }) => (
              <div className="space-y-2">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex !items-start space-x-2">
                    <Form.Item
                      {...restField}
                      name={[name]}
                      className="flex-1 mb-0"
                    >
                      <Input placeholder="Nhập tính năng chưa hỗ trợ..." className="rounded-xl py-1.5" />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      onClick={() => remove(name)}
                      icon={<TrashIcon className="h-4 w-4" />}
                      className="w-9 h-9 hover:bg-rose-50 rounded-lg flex items-center justify-center shrink-0"
                    />
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add('')}
                  block
                  icon={<PlusIcon className="h-4 w-4 inline" />}
                  className="rounded-xl mt-2 border-slate-300 text-slate-600 hover:text-rose-600 hover:border-rose-300"
                >
                  Thêm tính năng chưa hỗ trợ
                </Button>
              </div>
            )}
          </Form.List>
        </div>
      </Form>
    </Drawer>
  );
};

export default FormUpdate;
