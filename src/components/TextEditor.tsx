import { twMerge } from 'tailwind-merge'
import type { CSSProperties } from 'react'
import type { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import {
  Bold,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Underline as UnderlineIcon,
} from 'lucide-react'

function MenuBar({ editor, color }: { editor: Editor; color?: string }) {
  const activeColor: CSSProperties = color
    ? { backgroundColor: `rgb(${color.replaceAll(' ', '')})` }
    : {}
  return (
    <div className="flex items-center gap-2 pb-1">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={twMerge(
          'hover:bg-slate-100 p-1 rounded-md',
          editor.isActive('bold') && 'bg-primary hover:bg-primary'
        )}
        style={editor.isActive('bold') ? { ...activeColor } : undefined}
      >
        <Bold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={twMerge(
          'hover:bg-slate-100 p-1 rounded-md',
          editor.isActive('underline') && 'bg-primary hover:bg-primary'
        )}
        style={editor.isActive('underline') ? { ...activeColor } : undefined}
      >
        <UnderlineIcon />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={twMerge(
          'hover:bg-slate-100 p-1 rounded-md',
          editor.isActive('bulletList') && 'bg-primary hover:bg-primary'
        )}
        style={editor.isActive('bulletList') ? { ...activeColor } : undefined}
      >
        <List />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={twMerge(
          'hover:bg-slate-100 p-1 rounded-md',
          editor.isActive('orderedList') && 'bg-primary hover:bg-primary'
        )}
        style={editor.isActive('orderedList') ? { ...activeColor } : undefined}
      >
        <ListOrdered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={twMerge(
          'hover:bg-slate-100 p-1 rounded-md',
          editor.isActive('highlight') && 'bg-primary hover:bg-primary'
        )}
        style={editor.isActive('highlight') ? { ...activeColor } : undefined}
      >
        <Highlighter />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={twMerge(
          'hover:bg-slate-100 p-1 rounded-md',
          editor.isActive('blockquote') && 'bg-primary hover:bg-primary'
        )}
        style={editor.isActive('blockquote') ? { ...activeColor } : undefined}
      >
        <Quote />
      </button>
    </div>
  )
}

type Props = {
  content: string
  handleSave: (value: string) => void
  color?: string
}

export default function TextEditor({ content, handleSave, color }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Placeholder.configure({
        placeholder: 'Write something ...',
      }),
      Underline,
    ],
    editorProps: {
      transformPastedText(text) {
        return text.replace(/\xA0/g, ' ')
      },
      transformPastedHTML(html) {
        return html.replace(/<[^>]*>/g, '')
      },
    },
    content,
    onBlur: ({ editor }) => handleSave(editor.getHTML()),
  })

  return (
    <>
      {editor && <MenuBar editor={editor} color={color} />}
      <EditorContent editor={editor} className="bg-white" />
    </>
  )
}
