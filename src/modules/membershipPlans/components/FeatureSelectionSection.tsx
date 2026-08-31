import { useEffect, useState } from 'react';
import { Switch, Spin, Tooltip } from 'antd';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useFeaturesQuery, FEATURE_STATUS, type Feature } from '../../features';
import type { PlanFeatureItem } from '../types';

interface PlanFeatureConfig {
  featureId: number;
  isAvailable: boolean;
}

interface FeatureSelectionSectionProps {
  initialPlanFeatures?: PlanFeatureItem[];
  isLocked?: boolean;
  onChange: (planFeatures: PlanFeatureConfig[]) => void;
}

const EMPTY_PLAN_FEATURES: PlanFeatureItem[] = [];

const FeatureSelectionSection = ({
  initialPlanFeatures = EMPTY_PLAN_FEATURES,
  isLocked = false,
  onChange,
}: FeatureSelectionSectionProps) => {
  const { data: features = [], isLoading } = useFeaturesQuery({
    status: FEATURE_STATUS.ACTIVE,
  });

  // Map featureId -> PlanFeatureConfig
  const [featureConfigMap, setFeatureConfigMap] = useState<Record<number, PlanFeatureConfig>>({});

  const initialFeaturesJson = JSON.stringify(initialPlanFeatures);

  useEffect(() => {
    if (features.length > 0) {
      const configMap: Record<number, PlanFeatureConfig> = {};

      features.forEach((feat) => {
        const existing = initialPlanFeatures.find((pf) => pf.featureId === feat.id);
        configMap[feat.id] = {
          featureId: feat.id,
          isAvailable: existing ? existing.isAvailable : false,
        };
      });

      setFeatureConfigMap(configMap);
    }
  }, [features, initialFeaturesJson]);

  const handleToggle = (feat: Feature, checked: boolean) => {
    const initialConfig = initialPlanFeatures.find((pf) => pf.featureId === feat.id);
    const wasInitiallyAvailable = Boolean(initialConfig?.isAvailable);

    // Nếu gói đã được sử dụng và tính năng này vốn đã khả dụng, không cho phép tắt
    if (isLocked && wasInitiallyAvailable && !checked) {
      return;
    }

    const nextConfig: PlanFeatureConfig = {
      featureId: feat.id,
      isAvailable: checked,
    };

    const nextMap = {
      ...featureConfigMap,
      [feat.id]: nextConfig,
    };

    setFeatureConfigMap(nextMap);
    onChange(Object.values(nextMap));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spin tip="Đang tải danh sách tính năng..." />
      </div>
    );
  }

  return (
    <div className="border-t border-slate-100 pt-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">Cấu hình Tính năng & Quyền lợi</h4>
          <p className="text-xs text-slate-500">
            {isLocked
              ? 'Gói hội viên đã được sử dụng: Không thể tắt tính năng đang khả dụng, nhưng vẫn có thể bật thêm tính năng mới.'
              : 'Bật/tắt công tắc để xác định tính năng đó có khả dụng trong gói hội viên này hay không.'}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {features.map((feat) => {
          const config = featureConfigMap[feat.id];
          const isAvailable = Boolean(config?.isAvailable);

          const initialConfig = initialPlanFeatures.find((pf) => pf.featureId === feat.id);
          const wasInitiallyAvailable = Boolean(initialConfig?.isAvailable);
          
          // Chỉ disable switch đối với tính năng VỐN ĐÃ KHẢ DỤNG khi gói bị locked (không cho tắt)
          const isSwitchDisabled = isLocked && wasInitiallyAvailable;

          return (
            <div
              key={feat.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isAvailable
                  ? 'border-sky-200 bg-sky-50/30'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start space-x-3 pr-2">
                {isAvailable ? (
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-medium text-slate-800 text-sm">{feat.name}</span>
                  {feat.description && (
                    <Tooltip title={feat.description} placement="topLeft">
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 cursor-help">
                        {feat.description}
                      </p>
                    </Tooltip>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`text-xs font-semibold ${
                    isAvailable ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {isAvailable ? 'Khả dụng' : 'Không hỗ trợ'}
                </span>
                <Tooltip
                  title={
                    isSwitchDisabled
                      ? 'Gói hội viên đã có người đăng ký hoặc lịch sử giao dịch, không thể tắt tính năng đang khả dụng'
                      : undefined
                  }
                >
                  <span className="inline-block">
                    <Switch
                      disabled={isSwitchDisabled}
                      checked={isAvailable}
                      onChange={(checked) => handleToggle(feat, checked)}
                      className={isAvailable ? 'bg-sky-500' : 'bg-slate-300'}
                    />
                  </span>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureSelectionSection;
