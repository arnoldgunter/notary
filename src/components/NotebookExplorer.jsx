import { useState, useEffect, useRef } from "react";
import {
  FolderSimplePlusIcon,
  FunnelSimpleIcon,
  SquaresFourIcon,
  ListIcon,
  ArrowsClockwiseIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";

import styles from "../css/notebookexplorer.module.css";

export default function NotebookExplorer({
  notebooks,
  newNotebookName,
  setNewNotebookName,
  addNotebook,
  selectedNotebook,
  setSelectedNotebook,
  loadNotes,
  notes,
  newNote,
  setNewNote,
  addNote,
  deleteNotebook,
  deleteNote,
  updateNote,
  updateNotebook,
  setSelectedNote,
  selectedNote,
  init,
}) {
  const [showAddNotebook, setShowAddNotebook] = useState(false);
  const [showNewNote, setShowNewNote] = useState(false);
  const dialogRef = useRef(null);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayType, setDisplayType] = useState("grid");
  const [folderContextVisible, setFolderContextVisible] = useState(false);
  const [notebookContextId, setNotebookContextId] = useState(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowAddNotebook(false);
        setSearchBarVisible(false);
        setSelectedNotebook(null);
        setShowNewNote(false);
        setFolderContextVisible(false);
      }
    }

    function handleClickOutside(e) {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        setShowAddNotebook(false);
        setSelectedNotebook(null);
        setShowNewNote(false);
      }
    }

    if (
      showAddNotebook ||
      searchBarVisible ||
      selectedNotebook ||
      showNewNote ||
      folderContextVisible
    ) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddNotebook, searchBarVisible, selectedNotebook]);

  return (
    <div className={styles.explorerContainer}>
      {notebooks.length === 0 && (
        <div className={styles.emptyContainer}>
          <h2 className={styles.emptyTitle}>No notebooks yet</h2>
          <p className={styles.emptySubtitle}>
            Create your first notebook to get started!
          </p>
          <button
            className={styles.addNotebookButton}
            onClick={() => setShowAddNotebook(true)}
          >
            <PlusIcon size={32} className={styles.addNotebookIcon} />
            Create Notebook
          </button>
        </div>
      )}

      {showAddNotebook && (
        <div className={styles.overlay}>
          <div ref={dialogRef} className={styles.addNotebookDialog}>
            <input
              type="text"
              placeholder="Enter name"
              className={styles.addNotebookInput}
              onInput={(e) => setNewNotebookName(e.target.value)}
            />
            <button
              className={styles.addNotebookButton}
              onClick={() => {
                if (!newNotebookName) return;
                addNotebook();
                setShowAddNotebook(false);
              }}
            >
              <PlusIcon size={32} className={styles.addNotebookIcon} />
              Create Notebook
            </button>
          </div>
        </div>
      )}

      {notebooks.length > 0 && (
        <div className={styles.toolBar}>
          <FolderSimplePlusIcon
            size={24}
            className={styles.toolBarIcon}
            onClick={() => setShowAddNotebook(true)}
          />
          <FunnelSimpleIcon size={24} className={styles.toolBarIcon} />
          {displayType === "grid" && (
            <ListIcon
              size={24}
              className={styles.toolBarIcon}
              onClick={() => setDisplayType("list")}
            />
          )}
          {displayType === "list" && (
            <SquaresFourIcon
              size={24}
              className={styles.toolBarIcon}
              onClick={() => setDisplayType("grid")}
            />
          )}
          <ArrowsClockwiseIcon
            size={24}
            className={styles.toolBarIcon}
            onClick={() => init()}
          />
          <MagnifyingGlassIcon
            size={24}
            className={styles.toolBarIcon}
            onClick={() => setSearchBarVisible(true)}
          />
        </div>
      )}

      {searchBarVisible && (
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search notebooks..."
            className={styles.searchInput}
            value={searchTerm}
            onInput={(e) => setSearchTerm(e.target.value)}
          />
          <XIcon
            size={32}
            className={styles.closeIcon}
            onClick={() => {
              setSearchBarVisible(false);
              setSearchTerm("");
            }}
          />
        </div>
      )}

      {selectedNotebook && (
        <div className={styles.overlay}>
          <div className={styles.noteList} ref={dialogRef}>
            {showNewNote ? (
              <div className={styles.newNoteContainer}>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  className={styles.newNoteInput}
                  value={newNote}
                  onInput={(e) => setNewNote(e.target.value)}
                />
                <button
                  className={styles.addNoteButton}
                  onClick={() => {
                    if (!newNote) return;
                    addNote();
                    setShowNewNote(false);
                  }}
                >
                  <PlusIcon size={32} className={styles.addNoteIcon} />
                  Create Note
                </button>
              </div>
            ) : (
              <div
                className={styles.newNoteItem}
                onClick={() => setShowNewNote(true)}
              >
                <img src="/new.svg" alt="New Note" />
                New Note
              </div>
            )}
            {notes.length === 0 ? (
              <p className={styles.emptyMessage}>
                No notes yet. Create your first note!
              </p>
            ) : (
              <div className={styles.notesContainer}>
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={styles.noteItem}
                    onClick={() => setSelectedNote(note.id)}
                  >
                    <img src="/note.svg" alt="Note" />
                    {JSON.parse(note.content).name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {folderContextVisible && (
        <div
          className={styles.overlay}
          onClick={() => setFolderContextVisible(false)}
        >
          <div
            className={[styles.folderContextMenu].join(" ")}
            style={{
              top: `${folderContextVisible.y}px`,
              left: `${folderContextVisible.x}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              onClick={() => {
                if (!notebookContextId) return;
                const newName = window.prompt(
                  "Enter new notebook name:",
                  notebooks.find((nb) => nb.id === notebookContextId)?.name ||
                    "",
                );
                if (newName && newName.trim()) {
                  updateNotebook(notebookContextId, newName.trim());
                  setFolderContextVisible(false);
                }
                setFolderContextVisible(false);
              }}
            >
              <PencilSimpleIcon size={24} /> Rename
            </p>
            <p
              onClick={() => {
                if (!notebookContextId) return;
                if (
                  window.confirm(
                    "Are you sure you want to delete this notebook? All notes inside will be deleted as well.",
                  )
                ) {
                  deleteNotebook(notebookContextId);
                  setFolderContextVisible(false);
                }
                setFolderContextVisible(false);
              }}
            >
              <TrashIcon size={24} /> Delete
            </p>
          </div>
        </div>
      )}

      <ul className={displayType === "grid" ? styles.grid : styles.list}>
        {notebooks
          .filter((nb) =>
            nb.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((nb) => (
            <li
              key={nb.id}
              className={styles.notebookItem}
              onContextMenu={(e) => {
                setNotebookContextId(nb.id);
                setFolderContextVisible({ x: e.clientX, y: e.clientY });
              }}
              onClick={() => {
                setSelectedNotebook(nb.id);
                loadNotes(nb.id);
              }}
            >
              <img src="/folder.svg" alt="Notebook" />
              {nb.name.length > 20 && displayType === "grid"
                ? nb.name.slice(0, 17) + "..."
                : nb.name}
            </li>
          ))}
      </ul>
    </div>
  );
}
