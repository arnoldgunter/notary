import { useState, useEffect } from "react";
import {
  initDB,
  addNotebook,
  getNotes,
  addNote,
  getNotebooks,
  deleteNote,
  deleteNotebook,
  updateNote,
  updateNotebook,
} from "./lib/db";
import "./App.css";

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

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

  const init = async () => {
    await initDB();
    await loadNotebooks();
    setLoading(false);
  };

  // DB + Notebooks initial laden
  useEffect(() => {
    init();
  }, []);

  // Alle Notebooks laden
  const loadNotebooks = async () => {
    const notebooks = await getNotebooks();
    setNotebooks(notebooks);
  };

  // Notes für ausgewähltes Notebook laden
  const loadNotes = async (notebookId) => {
    if (!notebookId) return;
    const n = await getNotes(notebookId);
    setNotes(n);
  };

  // Neues Notebook hinzufügen
  const handleAddNotebook = async () => {
    if (!newNotebookName) return;
    const id = await addNotebook(newNotebookName);
    setNewNotebookName("");
    await loadNotebooks();
    setSelectedNotebook(id);
  };

  // Neue Note hinzufügen
  const handleAddNote = async () => {
    if (!newNote || !selectedNotebook) return;
    await addNote(selectedNotebook, { name: newNote });
    setNewNote("");
    await loadNotes(selectedNotebook);
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId);
    await loadNotes(selectedNotebook);
  };

  // Delete notebook
  const handleDeleteNotebook = async (notebookId) => {
    await deleteNotebook(notebookId);
    await loadNotebooks();
    setSelectedNotebook(null);
    setNotes([]);
  };

  // Update note
  const handleUpdateNote = async (noteId, content, important) => {
    await updateNote(noteId, content, important);
    await loadNotes(selectedNotebook);
  };

  // Update notebook
  const handleUpdateNotebook = async (notebookId, name) => {
    await updateNotebook(notebookId, name);
    await loadNotebooks();
  };

  if (loading) return <Splash />;

  if (selectedNote == null) {
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
      <SimpleEditor/>
    </div>
  );
}

export default App;
