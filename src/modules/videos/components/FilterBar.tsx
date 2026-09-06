import type { Dispatch, SetStateAction } from 'react';
import { Input, Select } from 'antd';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { VideoType, VideoQueryParams } from '../types';
import { STATUS_OPTIONS, SOURCE_TYPE_OPTIONS } from '../constants';

interface FilterBarProps {
  videoTypes: VideoType[];
  params: VideoQueryParams;
  setParams: Dispatch<SetStateAction<VideoQueryParams>>;
  disabled?: boolean;
}

export const FilterBar = ({ videoTypes, params, setParams, disabled = false }: FilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="h-11 rounded-xl flex gap-2 items-center justify-center border-slate-200 text-slate-500" title="Bộ lọc">
        <FunnelIcon className="h-5 w-5" />
        <span>Bộ lọc</span>
      </span>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <div className="w-full sm:w-[180px]">
          <Select
            placeholder="Tất cả loại"
            allowClear
            disabled={disabled}
            className="w-full"
            value={params.videoTypeId}
            onChange={(val) => {
              setParams((prev) => ({ ...prev, videoTypeId: val, page: 1 }));
            }}
          >
            {videoTypes.map((vt) => (
              <Select.Option key={vt.id} value={vt.id}>
                {vt.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="w-full sm:w-[180px]">
          <Select
            placeholder="Tất cả nguồn"
            allowClear
            disabled={disabled}
            className="w-full"
            value={params.sourceType}
            onChange={(val) => {
              setParams((prev) => ({ ...prev, sourceType: val, page: 1 }));
            }}
          >
            {SOURCE_TYPE_OPTIONS.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="w-full sm:w-[180px]">
          <Select
            placeholder="Tất cả trạng thái"
            allowClear
            disabled={disabled}
            className="w-full"
            value={params.status}
            onChange={(val) => {
              setParams((prev) => ({ ...prev, status: val, page: 1 }));
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="w-full sm:w-[280px]">
          <Input
            placeholder="Tìm kiếm..."
            prefix={<MagnifyingGlassIcon className="h-5 w-5 text-slate-400 mr-1.5" />}
            value={params.search || ''}
            disabled={disabled}
            onChange={(e) => {
              const searchVal = e.target.value;
              setParams((prev) => ({ ...prev, search: searchVal, page: 1 }));
            }}
            allowClear
            className="w-full px-4 border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 text-slate-700 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

