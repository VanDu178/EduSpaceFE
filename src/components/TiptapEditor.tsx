import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Youtube } from '@tiptap/extension-youtube';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { useEffect, useState } from 'react';
import { Button, Tooltip, Popover, Input, Modal, Space } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  HighlightOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  CheckSquareOutlined,
  LinkOutlined,
  PictureOutlined,
  YoutubeOutlined,
  TableOutlined,
  CodeOutlined,
  MinusOutlined,
  UndoOutlined,
  RedoOutlined,
  FontColorsOutlined,
  ScissorOutlined,
} from '@ant-design/icons';
import { ReadMore } from './ReadMoreExtension';

const lowlight = createLowlight(common);

const preprocessContent = (content: string) => {
  if (!content) return content;
  return content.replace(
    /<!--\s*(more|teaser)\s*-->/gi,
    '<div data-type="read-more" class="read-more-divider"></div>'
  );
};

const postprocessContent = (html: string) => {
  if (!html) return html;
  return html.replace(
    /<div[^>]*data-type="read-more"[^>]*>[\s\S]*?<\/div>/gi,
    '<!--more-->'
  );
};

interface TiptapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TiptapEditor = ({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung chi tiết bài viết của bạn tại đây...',
  disabled = false,
}: TiptapEditorProps) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const [isEmpty, setIsEmpty] = useState(() => {
    if (!value) return true;
    const clean = value.replace(/<[^>]*>/g, '').trim();
    return clean.length === 0;
  });

  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Superscript,
      Subscript,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-600 underline font-medium hover:text-sky-800',
        },
      }),
      Youtube.configure({
        inline: false,
        width: 640,
        height: 380,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      ReadMore,
    ],
    content: preprocessContent(value),
    onUpdate: ({ editor }) => {
      setIsEmpty(editor.isEmpty);
      const rawHtml = editor.getHTML();
      const processedHtml = postprocessContent(rawHtml);
      if (onChange) {
        onChange(processedHtml);
      }
    },
    onSelectionUpdate: ({ editor }) => {
      setIsEmpty(editor.isEmpty);
    },
    onTransaction: ({ editor }) => {
      setIsEmpty(editor.isEmpty);
    },
    editorProps: {
      attributes: {
        class:
          'prose max-w-none focus:outline-none min-h-[380px] p-4 text-slate-800 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul[data-type="taskList"]]:list-none [&_ul[data-type="taskList"]]:pl-0 [&_li[data-type="taskItem"]]:flex [&_li[data-type="taskItem"]]:items-center [&_li[data-type="taskItem"]]:gap-2 [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_table]:border-collapse [&_table]:w-full [&_table]:my-4 [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 [&_th]:border [&_th]:border-slate-200 [&_th]:p-2 [&_th]:bg-slate-50 [&_th]:font-semibold',
      },
    },
  });

  // Synchronize value from parent if updated externally
  useEffect(() => {
    if (editor && value !== undefined) {
      const processedInput = preprocessContent(value);
      const currentOutput = postprocessContent(editor.getHTML());
      const valueOutput = postprocessContent(value);
      if (currentOutput !== valueOutput) {
        editor.commands.setContent(processedInput);
      }
      setIsEmpty(editor.isEmpty);
    }
  }, [value, editor]);

  // Synchronize editable state when disabled prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setIsLinkModalOpen(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImageModalOpen(false);
    }
  };

  const addYoutube = () => {
    if (youtubeUrl) {
      editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
      setYoutubeUrl('');
      setIsYoutubeModalOpen(false);
    }
  };

  const textColors = ['#000000', '#475569', '#2563eb', '#059669', '#d97706', '#dc2626', '#9333ea'];
  const highlightColors = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa', '#e2e8f0'];

  return (
    <div className={`border border-slate-200 rounded-xl bg-white transition-opacity ${disabled ? 'pointer-events-none opacity-60 select-none' : ''}`}>
      {/* Toolbar */}
      <div className="sticky top-[-16px] z-20 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80 p-2 flex flex-wrap items-center gap-1 rounded-t-xl">
        {/* Undo / Redo */}
        <Tooltip title="Hoàn tác (Undo)">
          <Button
            type="text"
            size="small"
            icon={<UndoOutlined />}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
        </Tooltip>
        <Tooltip title="Làm lại (Redo)">
          <Button
            type="text"
            size="small"
            icon={<RedoOutlined />}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
        </Tooltip>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Text Formats */}
        <Tooltip title="In đậm (Ctrl+B)">
          <Button
            type={editor.isActive('bold') ? 'primary' : 'text'}
            size="small"
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
        </Tooltip>
        <Tooltip title="In nghiêng (Ctrl+I)">
          <Button
            type={editor.isActive('italic') ? 'primary' : 'text'}
            size="small"
            icon={<ItalicOutlined />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </Tooltip>
        <Tooltip title="Gạch chân (Ctrl+U)">
          <Button
            type={editor.isActive('underline') ? 'primary' : 'text'}
            size="small"
            icon={<UnderlineOutlined />}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
        </Tooltip>
        <Tooltip title="Gạch ngang">
          <Button
            type={editor.isActive('strike') ? 'primary' : 'text'}
            size="small"
            icon={<StrikethroughOutlined />}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          />
        </Tooltip>
        <Tooltip title="Chỉ số trên (Superscript)">
          <Button
            type={editor.isActive('superscript') ? 'primary' : 'text'}
            size="small"
            className="text-xs font-bold"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            x²
          </Button>
        </Tooltip>
        <Tooltip title="Chỉ số dưới (Subscript)">
          <Button
            type={editor.isActive('subscript') ? 'primary' : 'text'}
            size="small"
            className="text-xs font-bold"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            x₂
          </Button>
        </Tooltip>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Color & Highlight */}
        <Popover
          content={
            <div className="flex items-center gap-1.5 p-1">
              {textColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  style={{ backgroundColor: color }}
                  className="w-5 h-5 rounded-full border border-slate-300 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
          }
          trigger="click"
        >
          <Tooltip title="Màu chữ">
            <Button type="text" size="small" icon={<FontColorsOutlined />} />
          </Tooltip>
        </Popover>

        <Popover
          content={
            <div className="flex items-center gap-1.5 p-1">
              {highlightColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  style={{ backgroundColor: color }}
                  className="w-5 h-5 rounded-full border border-slate-300 cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                />
              ))}
            </div>
          }
          trigger="click"
        >
          <Tooltip title="Màu nền chữ (Highlight)">
            <Button type="text" size="small" icon={<HighlightOutlined />} />
          </Tooltip>
        </Popover>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Headings */}
        <Tooltip title="Tiêu đề 1 (H1)">
          <Button
            type={editor.isActive('heading', { level: 1 }) ? 'primary' : 'text'}
            size="small"
            className="font-bold text-xs"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            H1
          </Button>
        </Tooltip>
        <Tooltip title="Tiêu đề 2 (H2)">
          <Button
            type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'text'}
            size="small"
            className="font-bold text-xs"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </Button>
        </Tooltip>
        <Tooltip title="Tiêu đề 3 (H3)">
          <Button
            type={editor.isActive('heading', { level: 3 }) ? 'primary' : 'text'}
            size="small"
            className="font-bold text-xs"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </Button>
        </Tooltip>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Alignment */}
        <Tooltip title="Căn trái">
          <Button
            type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'text'}
            size="small"
            icon={<AlignLeftOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          />
        </Tooltip>
        <Tooltip title="Căn giữa">
          <Button
            type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'text'}
            size="small"
            icon={<AlignCenterOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          />
        </Tooltip>
        <Tooltip title="Căn phải">
          <Button
            type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'text'}
            size="small"
            icon={<AlignRightOutlined />}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          />
        </Tooltip>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Lists */}
        <Tooltip title="Danh sách đầu dòng">
          <Button
            type={editor.isActive('bulletList') ? 'primary' : 'text'}
            size="small"
            icon={<UnorderedListOutlined />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
        </Tooltip>
        <Tooltip title="Danh sách số">
          <Button
            type={editor.isActive('orderedList') ? 'primary' : 'text'}
            size="small"
            icon={<OrderedListOutlined />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </Tooltip>
        <Tooltip title="Danh sách công việc (Task List)">
          <Button
            type={editor.isActive('taskList') ? 'primary' : 'text'}
            size="small"
            icon={<CheckSquareOutlined />}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          />
        </Tooltip>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Blocks & Media */}
        <Tooltip title="Khối trích dẫn (Blockquote)">
          <Button
            type={editor.isActive('blockquote') ? 'primary' : 'text'}
            size="small"
            className="font-bold text-xs"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            " "
          </Button>
        </Tooltip>
        <Tooltip title="Khối mã (Code Block)">
          <Button
            type={editor.isActive('codeBlock') ? 'primary' : 'text'}
            size="small"
            icon={<CodeOutlined />}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          />
        </Tooltip>
        <Tooltip title="Đường kẻ ngang">
          <Button
            type="text"
            size="small"
            icon={<MinusOutlined />}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
        </Tooltip>
        <Tooltip title="Chèn đường ngắt xem thử bài viết">
          <Button
            type={editor.isActive('readMore') ? 'primary' : 'text'}
            size="small"
            icon={<ScissorOutlined />}
            onClick={() => editor.chain().focus().setReadMore().run()}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Ngắt Teaser
          </Button>
        </Tooltip>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Table & Links */}
        <Popover
          content={
            <Space direction="vertical" size="small">
              <Button
                size="small"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              >
                Tạo bảng (3x3)
              </Button>
              <Button size="small" onClick={() => editor.chain().focus().addRowAfter().run()}>
                Thêm hàng dưới
              </Button>
              <Button size="small" onClick={() => editor.chain().focus().addColumnAfter().run()}>
                Thêm cột phải
              </Button>
              <Button size="small" onClick={() => editor.chain().focus().deleteRow().run()}>
                Xóa hàng
              </Button>
              <Button size="small" onClick={() => editor.chain().focus().deleteColumn().run()}>
                Xóa cột
              </Button>
              <Button size="small" onClick={() => editor.chain().focus().mergeCells().run()}>
                Gộp ô (Merge)
              </Button>
              <Button size="small" onClick={() => editor.chain().focus().splitCell().run()}>
                Tách ô (Split)
              </Button>
              <Button size="small" danger onClick={() => editor.chain().focus().deleteTable().run()}>
                Xóa bảng
              </Button>
            </Space>
          }
          trigger="click"
        >
          <Tooltip title="Bảng biểu (Table)">
            <Button type={editor.isActive('table') ? 'primary' : 'text'} size="small" icon={<TableOutlined />} />
          </Tooltip>
        </Popover>

        <Tooltip title="Chèn liên kết (Link)">
          <Button
            type={editor.isActive('link') ? 'primary' : 'text'}
            size="small"
            icon={<LinkOutlined />}
            onClick={() => setIsLinkModalOpen(true)}
          />
        </Tooltip>
        <Tooltip title="Chèn hình ảnh">
          <Button type="text" size="small" icon={<PictureOutlined />} onClick={() => setIsImageModalOpen(true)} />
        </Tooltip>
        <Tooltip title="Chèn Video YouTube">
          <Button type="text" size="small" icon={<YoutubeOutlined />} onClick={() => setIsYoutubeModalOpen(true)} />
        </Tooltip>
      </div>

      {/* Editor Content Area */}
      <div className="relative bg-white min-h-[380px] rounded-b-xl">
        {isEmpty && (
          <div
            onClick={() => editor.chain().focus().run()}
            className="absolute top-4 left-4 text-slate-300 text-sm italic pointer-events-auto cursor-text select-none z-10"
          >
            {placeholder}
          </div>
        )}
        <EditorContent editor={editor} />
      </div>

      {/* Modals for Link, Image, Youtube */}
      <Modal
        title="Chèn Liên kết"
        open={isLinkModalOpen}
        onOk={setLink}
        onCancel={() => setIsLinkModalOpen(false)}
        okText="Chèn"
        cancelText="Hủy"
        width={400}
      >
        <Input
          placeholder="https://example.com"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="mt-2"
        />
      </Modal>

      <Modal
        title="Chèn Hình ảnh URL"
        open={isImageModalOpen}
        onOk={addImage}
        onCancel={() => setIsImageModalOpen(false)}
        okText="Chèn"
        cancelText="Hủy"
        width={450}
      >
        <Input
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-2"
        />
      </Modal>

      <Modal
        title="Chèn Video YouTube"
        open={isYoutubeModalOpen}
        onOk={addYoutube}
        onCancel={() => setIsYoutubeModalOpen(false)}
        okText="Chèn"
        cancelText="Hủy"
        width={450}
      >
        <Input
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="mt-2"
        />
      </Modal>
    </div>
  );
};

export default TiptapEditor;
