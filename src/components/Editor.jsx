import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

export default function Editor({ note, onUpdate }) {
  const parsedContent = (() => {
    try {
      return note?.content ? JSON.parse(note.content) : {};
    } catch {
      return {};
    }
  })();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        image: false,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: parsedContent,

    onUpdate: ({ editor }) => {
      const json = editor.getJSON();

      if (note?.id) {
        onUpdate(note.id, JSON.stringify(json));
      }
    },
  });

  useEffect(() => {
    if (!editor) return;

    try {
      const content = note?.content
        ? JSON.parse(note.content)
        : { type: "doc", content: [] };

      editor.commands.setContent(content);
    } catch {
      editor.commands.setContent({ type: "doc", content: [] });
    }
  }, [note]);

  if (!editor) return null;

  return (
    <div className="editor-wrapper">
      <EditorContent editor={editor} />
    </div>
  );
}
