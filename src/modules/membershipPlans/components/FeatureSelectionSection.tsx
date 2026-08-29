import { useEffect, useState } from 'react';
import { Switch, Spin, Tooltip, Badge } from 'antd';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import { useFeaturesQuery, FEATURE_STATUS, type Feature } from '../../features';
import type { PlanFeatureItem } from '../types';
import ModalSunsetWorkflow from './ModalSunsetWorkflow';

interface PlanFeatureConfig {
  featureId: number;
  isAvailable: boolean;
  disabledAt?: string | null;
  compensateDays?: number;
  notifyReason?: string;
}

interface FeatureSelectionSectionProps {
  initialPlanFeatures?: PlanFeatureItem[];
  hasSubscribers?: boolean;
  subscriberCount?: number;
  onChange: (planFeatures: PlanFeatureConfig[]) => void;
}

const EMPTY_PLAN_FEATURES: PlanFeatureItem[] = [];

const FeatureSelectionSection = ({
  initialPlanFeatures = EMPTY_PLAN_FEATURES,
  hasSubscribers = false,
  subscriberCount = 0,
  onChange,
}: FeatureSelectionSectionProps) => {
  const { data: features = [], isLoading } = useFeaturesQuery({
    status: FEATURE_STATUS.ACTIVE,
  });

  // Map featureId -> PlanFeatureConfig
  const [featureConfigMap, setFeatureConfigMap] = useState<Record<number, PlanFeatureConfig>>({});

  // State quản lý modal Sunset Workflow
  const [activeSunsetFeature, setActiveSunsetFeature] = useState<Feature | null>(null);

  const initialFeaturesJson = JSON.stringify(initialPlanFeatures);

  // Cập nhật khi features hoặc initialPlanFeatures thay đổi
  useEffect(() => {
    if (features.length > 0) {
      const configMap: Record<number, PlanFeatureConfig> = {};

      features.forEach((feat) => {
        const existing = initialPlanFeatures.find((pf) => pf.featureId === feat.id);
        if (existing) {
          configMap[feat.id] = {
            featureId: feat.id,
            isAvailable: existing.isAvailable,
            disabledAt: existing.disabledAt || null,
          };
        } else {
          configMap[feat.id] = {
            featureId: feat.id,
            isAvailable: false,
            disabledAt: null,
          };
        }
      });

      setFeatureConfigMap(configMap);
    }
  }, [features, initialFeaturesJson]);

  const handleToggle = (feat: Feature, checked: boolean) => {
    const currentConfig = featureConfigMap[feat.id];

    // Nếu gạt TẮT một tính năng đang khả dụng VÀ gói có người dùng active
    if (!checked && currentConfig?.isAvailable && hasSubscribers && subscriberCount > 0) {
      setActiveSunsetFeature(feat);
      return;
    }

    // Nếu chuyển BẬT hoặc gói chưa có người dùng
    const nextConfig: PlanFeatureConfig = {
      featureId: feat.id,
      isAvailable: checked,
      disabledAt: null,
    };

    const nextMap = {
      ...featureConfigMap,
      [feat.id]: nextConfig,
    };

    setFeatureConfigMap(nextMap);
    notifyChange(nextMap);
  };

  const handleConfirmSunset = (result: {
    disabledAt: string | null;
    compensateDays: number;
    notifyReason: string;
  }) => {
    if (!activeSunsetFeature) return;

    const featId = activeSunsetFeature.id;
    const nextConfig: PlanFeatureConfig = {
      featureId: featId,
      // Nếu có disabledAt (hẹn ngày) thì isAvailable vẫn giữ true cho tới ngày đó
      isAvailable: Boolean(result.disabledAt),
      disabledAt: result.disabledAt,
      compensateDays: result.compensateDays,
      notifyReason: result.notifyReason,
    };

    const nextMap = {
      ...featureConfigMap,
      [featId]: nextConfig,
    };

    setFeatureConfigMap(nextMap);
    notifyChange(nextMap);
    setActiveSunsetFeature(null);
  };

  const notifyChange = (map: Record<number, PlanFeatureConfig>) => {
    const list: PlanFeatureConfig[] = Object.values(map);
    onChange(list);
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
            Bật/tắt công tắc để xác định tính năng đó có khả dụng trong gói hội viên này hay không.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {features.map((feat) => {
          const config = featureConfigMap[feat.id];
          const isAvailable = Boolean(config?.isAvailable);
          const disabledAt = config?.disabledAt;
          const isPendingDisable = Boolean(disabledAt && dayjs(disabledAt).isAfter(dayjs()));

          return (
            <div
              key={feat.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isPendingDisable
                  ? 'border-amber-300 bg-amber-50/50'
                  : isAvailable
                  ? 'border-sky-200 bg-sky-50/30'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex items-start space-x-3 pr-2">
                {isPendingDisable ? (
                  <ClockIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                ) : isAvailable ? (
                  <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-800 text-sm">{feat.name}</span>
                    {isPendingDisable && (
                      <Badge
                        count={`Hẹn tắt: ${dayjs(disabledAt).format('DD/MM/YYYY')}`}
                        className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                      />
                    )}
                  </div>
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
                    isPendingDisable
                      ? 'text-amber-600'
                      : isAvailable
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {isPendingDisable ? 'Đang hẹn tắt' : isAvailable ? 'Khả dụng' : 'Không hỗ trợ'}
                </span>
                <Switch
                  checked={isAvailable || isPendingDisable}
                  onChange={(checked) => handleToggle(feat, checked)}
                  className={isAvailable || isPendingDisable ? 'bg-sky-500' : 'bg-slate-300'}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Sunset Workflow khi tắt tính năng gói có người dùng */}
      {activeSunsetFeature && (
        <ModalSunsetWorkflow
          open={Boolean(activeSunsetFeature)}
          featureName={activeSunsetFeature.name}
          subscriberCount={subscriberCount}
          onCancel={() => setActiveSunsetFeature(null)}
          onConfirm={handleConfirmSunset}
        />
      )}
    </div>
  );
};

export default FeatureSelectionSection;
