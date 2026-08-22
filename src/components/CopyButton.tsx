import { Tooltip, Button } from 'antd';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '../utils/copy';

interface CopyButtonProps {
  text?: string | null;
  tooltipText?: string;
  successMessage?: string;
  className?: string;
  iconClassName?: string;
}

const CopyButton = ({
  text,
  tooltipText = 'Sao chép',
  successMessage = 'Đã sao chép!',
  className = '',
  iconClassName = '',
}: CopyButtonProps) => {
  if (!text) return null;

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    copyToClipboard(text, successMessage);
  };

  return (
    <Tooltip title={tooltipText}>
      <Button
        type="text"
        size="small"
        onClick={handleCopy}
        icon={
          <DocumentDuplicateIcon
            className={`h-4 w-4 !text-slate-400/70 hover:text-sky-600 transition-colors duration-150 ${iconClassName}`}
          />
        }
        className={`p-0.5 h-auto min-w-0 border-none shadow-none flex items-center justify-center rounded hover:bg-slate-100 ${className}`}
      />
    </Tooltip>
  );
};

export default CopyButton;
