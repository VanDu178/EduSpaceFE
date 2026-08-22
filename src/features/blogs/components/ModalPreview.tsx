import { Modal, Space, Tag } from 'antd';
import { getStatusTagConfig, getAccessTagConfig, getBlogTypeTagConfig } from '../utils';

interface ModalPreviewProps {
  open: boolean;
  onCancel: () => void;
  title?: string;
  slug?: string;
  summary?: string;
  contentHtml?: string;
  bannerUrl?: string;
  selectedBlogType?: {
    code?: string;
    name?: string;
  };
  isPremium?: boolean;
  status?: string;
}

const ModalPreview = ({
  open,
  onCancel,
  title,
  slug,
  summary,
  contentHtml,
  bannerUrl,
  selectedBlogType,
  isPremium,
  status,
}: ModalPreviewProps) => {
  const statusConfig = getStatusTagConfig(status);
  const accessConfig = getAccessTagConfig(isPremium);
  const typeConfig = getBlogTypeTagConfig(selectedBlogType?.code);

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={860}
      centered
      styles={{ body: { padding: '20px', backgroundColor: '#ffffff', maxHeight: '85vh', overflowY: 'auto' } }}
      className="preview-modal rounded-xl overflow-hidden"
    >
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Banner Image Preview */}
        {bannerUrl && (
          <div className="w-full h-48 rounded-lg overflow-hidden border border-slate-100">
            <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Meta header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Space>
            <Tag
              color={statusConfig.color}
              className="!font-semibold px-2.5 py-0.5 !rounded-md !border-none text-xs"
            >
              {statusConfig.label}
            </Tag>

            <Tag
              color={typeConfig.color}
              className="!font-semibold px-2.5 py-0.5 !rounded-md !border-none text-xs"
            >
              {selectedBlogType?.name || typeConfig.label}
            </Tag>

            <Tag
              color={accessConfig.color}
              className="!font-semibold px-2.5 py-0.5 !rounded-md !border-none text-xs flex items-center gap-1"
            >
              {accessConfig.label}
            </Tag>
          </Space>
        </div>


        {/* Title */}
        <h1 className="text-2xl font-extrabold text-slate-800 leading-tight">
          {title || <span className="text-slate-300 italic">Tiêu đề chưa nhập...</span>}
        </h1>
        {/* Summary Excerpt */}
        {summary ? (
          <div className="bg-slate-50 border-l-3 border-sky-500 p-3 rounded-r-lg">
            <p className="text-slate-600 italic text-xs leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
        ) : (
          <div className="bg-slate-50/50 border-l-3 border-slate-200 p-2.5 rounded-r-lg">
            <p className="text-slate-300 italic text-xs">Chưa có mô tả ngắn...</p>
          </div>
        )}

        {/* Content Body */}
        <div
          className="text-slate-700 text-sm leading-relaxed space-y-3 break-words prose max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: contentHtml || '<p class="text-slate-400 italic">Nội dung chi tiết chưa nhập...</p>',
          }}
        />
      </div>
    </Modal>
  );
};

export default ModalPreview;
