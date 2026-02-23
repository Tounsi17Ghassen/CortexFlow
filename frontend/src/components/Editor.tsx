import { useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useWorkspaceStore } from '../store';

interface Page {
  _id: string;
  title: string;
  content: any;
  workspace: string;
  parent?: string;
  archived: boolean;
}

interface EditorProps {
  page: Page;
}

export default function Editor({ page }: EditorProps) {
  const { updatePage } = useWorkspaceStore();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: page.content || '<p>Start writing...</p>',
    onUpdate: ({ editor }) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        updatePage(page._id, { content: editor.getJSON() });
      }, 1000);
    },
  });

  useEffect(() => {
    if (editor && page.content) {
      editor.commands.setContent(page.content);
    }
  }, [page._id]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        updatePage(page._id, { title: e.target.value });
      }, 800);
    },
    [page._id, updatePage]
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 32px' }}>
      <input
        defaultValue={page.title}
        onChange={handleTitleChange}
        placeholder="Untitled"
        style={{
          display: 'block',
          width: '100%',
          fontSize: '32px',
          fontWeight: 700,
          color: '#111827',
          border: 'none',
          outline: 'none',
          marginBottom: '24px',
          fontFamily: 'sans-serif',
        }}
      />
      <div
        style={{
          fontSize: '15px',
          lineHeight: '1.7',
          color: '#374151',
          fontFamily: 'sans-serif',
        }}
      >
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .ProseMirror {
          outline: none;
          min-height: 400px;
        }
        .ProseMirror p { margin: 0.5em 0; }
        .ProseMirror h1 { font-size: 1.8em; font-weight: 700; margin: 1em 0 0.5em; }
        .ProseMirror h2 { font-size: 1.4em; font-weight: 700; margin: 1em 0 0.5em; }
        .ProseMirror h3 { font-size: 1.2em; font-weight: 700; margin: 1em 0 0.5em; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.5em; }
        .ProseMirror blockquote { border-left: 3px solid #e5e7eb; padding-left: 1em; color: #6b7280; }
        .ProseMirror code { background: #f3f4f6; padding: 0.1em 0.3em; border-radius: 3px; font-size: 0.9em; }
        .ProseMirror pre { background: #1f2937; color: #f9fafb; padding: 1em; border-radius: 6px; overflow-x: auto; }
      `}</style>
    </div>
  );
}
