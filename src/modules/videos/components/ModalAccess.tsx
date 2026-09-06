import { useEffect } from 'react';
import { Modal, Form, TimePicker, Button } from 'antd';
import type { Video } from '../types';
import { secondsToDayjs, dayjsToSeconds } from '../utils';
import { formatTime } from '../../../utils/format';

interface ModalAccessProps {
  open: boolean;
  video: Video | null;
  onSubmit: (teaserDuration: number) => void;
  onClose: () => void;
}

export const ModalAccess = ({
  open,
  video,
  onSubmit,
  onClose,
}: ModalAccessProps) => {
  const [form] = Form.useForm();

  // Nạp lại thời lượng xem thử cũ khi video hoặc trạng thái open thay đổi
  useEffect(() => {
    if (open && video) {
      form.setFieldsValue({
        teaserTime: secondsToDayjs(video.teaserDuration),
      });
    } else {
      form.resetFields();
    }
  }, [open, video, form]);

  const handleFinish = (values: any) => {
    const teaserDuration = dayjsToSeconds(values.teaserTime);
    onSubmit(teaserDuration);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-base font-bold text-slate-800">
          Cập nhật
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={440}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="pt-2 space-y-4"
      >
        {video && (
          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-1">
                Video
              </span>
              <p className="text-sm font-semibold text-slate-800 m-0 line-clamp-2 leading-snug">
                {video.title}
              </p>
            </div>

            <div className="flex items-center justify-between py-2 border-y border-slate-100 text-xs">
              <span className="font-semibold text-slate-600">Thời lượng video</span>
              <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                {formatTime(video.duration)}
              </span>
            </div>
          </div>
        )}

        <Form.Item
          name="teaserTime"
          label={<span className="text-xs font-semibold text-slate-700">Thời gian xem thử</span>}
          rules={[
            () => ({
              validator(_, value) {
                if (!video) return Promise.resolve();
                const teaserSec = dayjsToSeconds(value);
                const durationSec = video.duration || 0;

                if (durationSec > 0 && teaserSec >= durationSec) {
                  return Promise.reject(
                    new Error(`Thời gian xem thử phải nhỏ hơn thời lượng video (${formatTime(durationSec)})`)
                  );
                }
                if (durationSec === 0 && teaserSec > 0) {
                  return Promise.reject(
                    new Error('Video hiện chưa có thời lượng, thời gian xem thử phải là 00:00:00')
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
          className="mb-0"
        >
          <TimePicker
            format="HH:mm:ss"
            placeholder="00:00:00"
            className="w-full rounded-lg"
            needConfirm={false}
          />
        </Form.Item>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            onClick={onClose}
            className="rounded-xl h-9 px-4 border-slate-200 text-slate-600 hover:text-slate-800 font-medium text-xs"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-gradient-to-r from-sky-500 to-cyan-600 border-none text-white font-semibold rounded-xl h-9 px-5 text-xs flex items-center justify-center cursor-pointer"
          >
            Cập nhật
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
