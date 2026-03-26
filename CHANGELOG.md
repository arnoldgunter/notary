# Changelog

## [Unreleased]

### feat: persist note selection, wire up editor, and improve notebook UX

**Note persistence & restoration**
- Add `localStorage` persistence so the selected note survives page reloads.
- Add `getNoteById()` to `db.js` for restoring the persisted note on startup.

**Editor integration**
- Fix `handleUpdateNote` to update only the TipTap JSON content (not `name`/`important`).
- Fix `handleAddNote` to default the note name to `"Untitled"` and initialise a valid TipTap document structure on creation.
- Add an `XIcon` close button in the editor view to return to the notebook explorer.
- Pass `note` and `onUpdate` props to `SimpleEditor` for live, two-way content sync.
- Clear `selectedNote` when the open note or its parent notebook is deleted.

**New `Editor.jsx` component**
- Standalone TipTap editor with `StarterKit` + `Image` support.
- Parses note content from JSON and persists changes via an `onUpdate` callback.

**`NotebookExplorer` refactor**
- Remove unused `deleteNote`, `updateNote`, and `selectedNote` props.
- Always register `keydown`/`mousedown` listeners (no conditional `addEventListener`).
- Switch `folderContextVisible` to `null` instead of `false` for safe truthiness checks.
- Convert all inputs from uncontrolled (`onInput`) to controlled (`onChange` + `value`).
- Pass the full note object to `setSelectedNote` instead of just `note.id`.
- Add `e.preventDefault()` to the notebook context-menu right-click handler.
- Guard note-title display with `try/catch` so malformed content shows `"Untitled"`.
- Simplify toolbar toggle and context-menu cleanup code.

**`tiptap-utils.js` fixes**
- Fix `handleImageUpload` to return a real base64 data URL via `FileReader` instead of a static placeholder path that does not exist at runtime.
- Fix `formatShortcutKey` to return `""` when `key` is `null`/`undefined`.
- Cache `isMac()` result in `parseShortcutKeys` and add `.filter(Boolean)` for safety.

**Housekeeping**
- Normalise `db.js` to use double quotes and add a trailing newline.
- Remove German-language inline comments throughout.
