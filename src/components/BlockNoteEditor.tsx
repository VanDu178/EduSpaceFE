import { useEffect, useRef } from 'react';
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { en } from "@blocknote/core/locales";

interface BlockNoteEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const BlockNoteEditor = ({
  value,
  onChange,
  placeholder,
}: BlockNoteEditorProps) => {
  const editor = useCreateBlockNote({
    dictionary: {
      ...en,
      placeholders: {
        ...en.placeholders,
        emptyDocument: placeholder || "Bắt đầu viết nội dung bài viết tuyệt vời của bạn ở đây...",
      },
    },
  });

  const isInitialized = useRef(false);

  // Load initial value
  useEffect(() => {
    if (editor && value !== undefined && !isInitialized.current) {
      if (value) {
        try {
          const blocks = editor.tryParseHTMLToBlocks(value);
          editor.replaceBlocks(editor.document, blocks);
        } catch (e) {
          console.error("Failed to parse initial HTML to BlockNote blocks", e);
        }
      }
      isInitialized.current = true;
    }
  }, [editor, value]);

  // Synchronize external value updates (e.g. form reset, external changes)
  useEffect(() => {
    if (!editor || !isInitialized.current) return;

    const currentHtml = editor.blocksToHTMLLossy(editor.document);

    // Handle external reset
    if (!value) {
      if (currentHtml && currentHtml !== '<p></p>' && currentHtml !== '<p class="bn-inline-content"></p>') {
        try {
          editor.replaceBlocks(editor.document, editor.tryParseHTMLToBlocks(''));
        } catch (e) {
          console.error("Failed to clear editor content", e);
        }
      }
      return;
    }

    // Handle external change (if the new value is different from editor's current HTML content)
    if (value !== currentHtml) {
      try {
        const blocks = editor.tryParseHTMLToBlocks(value);
        editor.replaceBlocks(editor.document, blocks);
      } catch (e) {
        console.error("Failed to parse external HTML to BlockNote blocks", e);
      }
    }
  }, [value, editor]);

  // Notify parent on change
  const handleChange = () => {
    if (onChange) {
      const html = editor.blocksToHTMLLossy(editor.document);
      onChange(html);
    }
  };

  return (
    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 hover:border-slate-200 focus-within:border-indigo-500 transition-colors">
      <BlockNoteView
        editor={editor}
        theme="light"
        onChange={handleChange}
        className="min-h-[350px]"
      />
    </div>
  );
};

export default BlockNoteEditor;
