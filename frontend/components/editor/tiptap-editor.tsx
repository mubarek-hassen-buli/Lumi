'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'
import { useEffect } from 'react'

const TiptapEditor = ({ content, onChange, onHtmlChange }: { 
    content: string, 
    onChange?: (c: string) => void,
    onHtmlChange?: (h: string) => void
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
    ],
    immediatelyRender: false,
    content: content,
    onUpdate: ({ editor }) => {
        onChange?.((editor.storage as any).markdown.getMarkdown()) 
        onHtmlChange?.(editor.getHTML())
    },
    editorProps: {
        attributes: {
            class: "tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] border p-4 rounded-md"
        }
    }
  })

  // Synchronize initial HTML content
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
        onHtmlChange?.(editor.getHTML());
    }
  }, [editor, onHtmlChange]);

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
        <div className="border-b p-2 mb-2 flex gap-2">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded" disabled={!editor.can().chain().focus().toggleBold().run()}>Bold</button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded" disabled={!editor.can().chain().focus().toggleItalic().run()}>Italic</button>
             <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="px-2 py-1 border rounded" disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default TiptapEditor
