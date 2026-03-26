import { useState, useEffect } from "react";
import {
  initDB,
  addNotebook,
  getNotes,
  addNote,
  getNotebooks,
  getNoteById,
  deleteNote,
  deleteNotebook,
  updateNote,
  updateNotebook,
} from "./lib/db";
import "./App.css";
import { XIcon } from "@phosphor-icons/react";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import Splash from "./components/splash";
import NotebookExplorer from "./components/NotebookExplorer";

function App() {
  const [loading, setLoading] = useState(true);
  const [notebooks, setNotebooks] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedNoteId");
    if (saved) {
      try {
        const noteId = JSON.parse(saved);

        const fetchNote = async () => {
          const note = await getNoteById(noteId);
          if (note) setSelectedNote(note);
        };

        fetchNote();
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (selectedNote) {
      localStorage.setItem("selectedNoteId", JSON.stringify(selectedNote.id));
    } else {
      localStorage.removeItem("selectedNoteId");
    }
  }, [selectedNote?.id]);

  const init = async () => {
    await initDB();
    await loadNotebooks();
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const loadNotebooks = async () => {
    const notebooks = await getNotebooks();
    setNotebooks(notebooks);
  };

  const loadNotes = async (notebookId) => {
    if (!notebookId) return;
    const n = await getNotes(notebookId);
    setNotes(n);
  };

  const handleAddNotebook = async () => {
    if (!newNotebookName.trim()) return;
    await addNotebook(newNotebookName);
    setNewNotebookName("");
    await loadNotebooks();
  };

  const handleAddNote = async () => {
    if (!selectedNotebook) return;

    await addNote(selectedNotebook, {
      name: newNote.trim() || "Untitled",
      content: {
        type: "doc",
        content: [],
      },
    });

    setNewNote("");
    await loadNotes(selectedNotebook);
  };

  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId);
    await loadNotes(selectedNotebook);

    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  const handleDeleteNotebook = async (notebookId) => {
    await deleteNotebook(notebookId);
    await loadNotebooks();
    setSelectedNotebook(null);
    setNotes([]);
    setSelectedNote(null);
  };

  const handleUpdateNote = async (noteId, content) => {
    try {
      const parsedContent = typeof content === "string" ? JSON.parse(content) : content;
      await updateNote(noteId, JSON.stringify(parsedContent));
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleUpdateNotebook = async (notebookId, name) => {
    await updateNotebook(notebookId, name);
    await loadNotebooks();
  };

  if (loading) return <Splash />;

  if (!selectedNote) {
    return (
      <div className="app-container" onContextMenu={(e) => e.preventDefault()}>
        <NotebookExplorer
          notebooks={notebooks}
          addNotebook={handleAddNotebook}
          newNotebookName={newNotebookName}
          setNewNotebookName={setNewNotebookName}
          selectedNotebook={selectedNotebook}
          setSelectedNotebook={setSelectedNotebook}
          loadNotes={loadNotes}
          notes={notes}
          newNote={newNote}
          setNewNote={setNewNote}
          addNote={handleAddNote}
          deleteNotebook={handleDeleteNotebook}
          deleteNote={handleDeleteNote}
          updateNote={handleUpdateNote}
          updateNotebook={handleUpdateNotebook}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          init={init}
        />
      </div>
    );
  }

  return (
    <div className="editor-container">
      <XIcon
        size={24}
        onClick={() => {
          setSelectedNote(null)
          loadNotes(selectedNotebook)
        }}
        className="closeNoteBtn"
      />

      <SimpleEditor
        note={selectedNote}
        onUpdate={(content) => handleUpdateNote(selectedNote.id, content)}
      />
    </div>
  );
}

export default App;
