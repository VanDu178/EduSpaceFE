import { Node, mergeAttributes } from '@tiptap/core';

export interface ReadMoreOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    readMore: {
      setReadMore: () => ReturnType;
    };
  }
}

export const ReadMore = Node.create<ReadMoreOptions>({
  name: 'readMore',

  group: 'block',

  atom: true,

  selectable: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {
        'data-type': 'read-more',
        class: 'read-more-divider',
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'div[data-type="read-more"]' },
      { tag: 'hr[data-type="read-more"]' },
      { tag: 'read-more' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'read-more',
        class:
          'read-more-divider my-6 border-y border-dashed border-amber-400 bg-amber-50/80 py-2.5 px-4 text-center select-none rounded-xl flex items-center justify-center gap-2 text-amber-700 font-semibold text-xs tracking-wide shadow-sm',
      }),
      [
        'span',
        { class: 'px-3 py-1 bg-amber-200/70 border border-amber-300 rounded-full flex items-center gap-1.5 text-amber-900 font-bold' },
        '✂ --- ĐƯỜNG NGẮT NỘI DUNG XEM THỬ ---',
      ],
    ];
  },

  addCommands() {
    return {
      setReadMore:
        () =>
          ({ chain }) => {
            return chain().insertContent({ type: this.name }).run();
          },
    };
  },
});
