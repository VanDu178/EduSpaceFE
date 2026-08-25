import { useEffect, useState } from 'react';
import { Switch, Spin, Tooltip } from 'antd';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { fetchFeaturesApi } from '../../features/api';
import type { Feature } from '../../features/types';
import type { PlanFeatureItem } from '../types';

interface FeatureSelectionSectionProps {
  initialPlanFeatures?: PlanFeatureItem[];
  onChange: (
    planFeatures: { featureId: number; isAvailable: boolean }[]
  ) => void;
}

const FeatureSelectionSection = ({
  initialPlanFeatures = [],
  onChange,
}: FeatureSelectionSectionProps) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // Map featureId -> isAvailable (boolean)
  const [featureState, setFeatureState] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        setLoading(true);
        const data = await fetchFeaturesApi({ status: 'active' });
        setFeatures(data);

        // Khởi tạo map trạng thái bật/tắt của từng tính năng
        const stateMap: Record<number, boolean> = {};

        data.forEach((feat) => {
          // Kiểm tra xem feature này có nằm trong initialPlanFeatures không
          const existing = initialPlanFeatures.find((pf) => pf.featureId === feat.id);
          if (existing) {
            stateMap[feat.id] = existing.isAvailable;
          } else {
            // Mặc định cho phép tính năng (hoặc false tùy chỉnh)
            stateMap[feat.id] = false;
          }
        });

        setFeatureState(stateMap);
      } catch (err) {
        console.error('Lỗi tải danh sách tính năng:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  // Cập nhật khi initialPlanFeatures thay đổi (ví dụ khi load dữ liệu gói cần sửa)
  useEffect(() => {
    if (features.length > 0 && initialPlanFeatures) {
      setFeatureState((prev) => {
        const next = { ...prev };
        features.forEach((feat) => {
          const existing = initialPlanFeatures.find((pf) => pf.featureId === feat.id);
          if (existing) {
            next[feat.id] = existing.isAvailable;
          }
        });
        return next;
      });
    }
  }, [initialPlanFeatures, features]);

  const handleToggle = (featureId: number, checked: boolean) => {
    const nextState = {
      ...featureState,
      [featureId]: checked,
    };
    setFeatureState(nextState);

    notifyChange(nextState);
  };

  const notifyChange = (state: Record<number, boolean>) => {
    const planFeaturesList: { featureId: number; isAvailable: boolean }[] = [];

    features.forEach((feat) => {
      const isAvailable = Boolean(state[feat.id]);
      planFeaturesList.push({ featureId: feat.id, isAvailable });
    });

    onChange(planFeaturesList);
  };

  if (loading) {
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
          const isAvailable = Boolean(featureState[feat.id]);

          return (
            <div
              key={feat.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isAvailable
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
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-800 text-sm">{feat.name}</span>
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
                  className={`text-xs font-semibold ${isAvailable ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                >
                  {isAvailable ? 'Khả dụng' : 'Không hỗ trợ'}
                </span>
                <Switch
                  checked={isAvailable}
                  onChange={(checked) => handleToggle(feat.id, checked)}
                  className={isAvailable ? 'bg-sky-500' : 'bg-slate-300'}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureSelectionSection;
