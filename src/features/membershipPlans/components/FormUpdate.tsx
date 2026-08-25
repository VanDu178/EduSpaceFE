import { useEffect, useState } from 'react';
import { Drawer, Form, Input, InputNumber, Select, Switch, Button } from 'antd';
import type { MembershipPlan, MembershipPlanPayload } from '../types';
import { BADGE_OPTIONS } from '../constants';
import FeatureSelectionSection from './FeatureSelectionSection';

interface FormUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: MembershipPlanPayload) => void;
  isLoading: boolean;
  plan: MembershipPlan | null;
}

const FormUpdate = ({ isOpen, onClose, onSave, isLoading, plan }: FormUpdateProps) => {
  const [form] = Form.useForm();
  const [planFeatures, setPlanFeatures] = useState<{ featureId: number; isAvailable: boolean }[]>([]);

  useEffect(() => {
    if (isOpen && plan) {
      form.setFieldsValue({
        name: plan.name,
        tagLine: plan.tagLine || '',
        monthlyPrice: Number(plan.monthlyPrice) || 0,
        yearlyDiscountPercent: Number(plan.yearlyDiscountPercent) || 0,
        yearlyPrice: Number(plan.yearlyPrice) || 0,
        popularBadge: plan.popularBadge || '',
        buttonText: plan.buttonText || '',
        tierLevel: plan.tierLevel ?? 1,
        isActive: plan.isActive,
      });

      if (plan.planFeatures) {
        setPlanFeatures(
          plan.planFeatures.map((pf) => ({
            featureId: pf.featureId,
            isAvailable: pf.isAvailable,
          }))
        );
      }
    } else {
      form.resetFields();
      setPlanFeatures([]);
    }
  }, [isOpen, plan, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if ('monthlyPrice' in changedValues || 'yearlyDiscountPercent' in changedValues) {
      const monthly = Number(allValues.monthlyPrice) || 0;
      const discount = Number(allValues.yearlyDiscountPercent) || 0;
      const computedYearly = Math.round(monthly * 12 * (1 - discount / 100));
      form.setFieldValue('yearlyPrice', computedYearly);
    }
  };

  const handleFeatureChange = (
    pf: { featureId: number; isAvailable: boolean }[]
  ) => {
    setPlanFeatures(pf);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      onSave({
        ...values,
        planFeatures: planFeatures.length > 0 ? planFeatures : undefined,
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Drawer
      title={<span className="text-lg font-bold text-slate-800">Cập nhật</span>}
      placement="right"
      width={600}
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
        onValuesChange={handleValuesChange}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            name="name"
            label={<span className="font-semibold text-slate-700">Tên</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            className="md:col-span-2"
          >
            <Input placeholder="Ví dụ: Gói Pro, Gói VIP..." className="rounded-xl py-2" />
          </Form.Item>

          <Form.Item
            name="tagLine"
            label={<span className="font-semibold text-slate-700">Khẩu hiệu</span>}
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
            name="yearlyDiscountPercent"
            label={<span className="font-semibold text-slate-700">% Giảm giá gói năm</span>}
          >
            <InputNumber<number>
              min={0}
              max={100}
              className="w-full rounded-xl"
              addonAfter="%"
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="yearlyPrice"
            label={<span className="font-semibold text-slate-700">Giá theo năm</span>}
            tooltip="Tự động tính theo công thức: Giá theo tháng × 12 × (100% - % Giảm giá)"
            rules={[{ required: true, message: 'Vui lòng nhập giá năm!' }]}
            className="md:col-span-2"
          >
            <InputNumber<number | string>
              min={0}
              step={100000}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
              className="w-full rounded-xl"
              addonAfter="VND"
              placeholder="0"
              disabled
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

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Form.Item
              name="tierLevel"
              label={<span className="font-semibold text-slate-700">Cấp độ gói</span>}
              rules={[{ required: true, message: 'Vui lòng nhập cấp độ gói!' }]}
            >
              <InputNumber min={1} className="w-full rounded-xl py-0.5" placeholder="1" />
            </Form.Item>

            <Form.Item
              name="isActive"
              valuePropName="checked"
              label={<span className="font-semibold text-slate-700">Kích hoạt ngay</span>}
            >
              <Switch className="bg-slate-300" />
            </Form.Item>
          </div>
        </div>

        {/* Dynamic Feature Switch Selection Section */}
        <FeatureSelectionSection
          initialPlanFeatures={plan?.planFeatures}
          onChange={handleFeatureChange}
        />
      </Form>
    </Drawer>
  );
};

export default FormUpdate;
