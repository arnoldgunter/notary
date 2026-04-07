# Changelog

## [Unreleased]

### Added

- Add notebook list metadata in list view (`notes_count` and formatted creation date).
- Add `notes_count` column to the `notebooks` table schema.
- Add new `ImportantMark` TipTap extension to mark important text segments.
- Add `important` mark support to mark-button utilities including icon mapping and shortcut (`mod+shift+m`).
- Add an `Important only` toolbar toggle to show only paragraphs containing important marks.

### Changed

- Wrap the editor close button in a `.note-header` container and display the current note title beside the icon.
- Truncate long note titles in both editor header and note cards for cleaner display.
- Refactor notebook list row markup to separate primary content (icon + name) from secondary details in list view.
- Convert notebook and note collections from flex-wrapping to CSS grid for more consistent alignment.
- Improve list spacing/alignment and note card readability (image sizing, wrapping, font sizing).
- Adjust `SimpleEditor` mobile toolbar breakpoint from `480px` to `800px`.
- Normalize formatting of `updateNote` in `db.js`.
- Replace template `README.md` with project-specific documentation including setup, architecture, and rationale for using Tauri over Electron.
- Update editor layout sizing/overflow and rotate the note header for a side-oriented header presentation.
- Add styles for important marks and `show-important-only` filtering behavior in the editor content area.
- Normalize formatting/style in `node-background-extension.js`.
- Rename editor shell class from `editor-container` to `editor-wrapper` and move editor theme tokens (`--tt-theme-text`, `--tt-theme-bg`) into app-level wrapper styling.
- Increase editor content max width from `648px` to `800px` and remove the Google Fonts `@import` from editor SCSS.
- Update dropdown menu dark-mode CSS variable scoping from nested `:root .dark` to a dedicated top-level `.dark` selector.
- Refine notebook list row layout by switching list items to CSS grid with explicit `2fr 1fr` columns.
- Normalize link URLs in the link popover (auto-prefix `https://` for host-like inputs) before setting/opening links, improving link reliability and safety.
- Add notebook sorting controls in the explorer via a funnel-triggered sort dialog with radio options for `name` and `created_at`.
- Apply sort state to filtered notebook results and update outside-click/Escape behavior to close sort and search popovers consistently.
- Add dedicated `sortDialog` styling for the new sort UI, including custom radio appearance.

### Fixed

- Increment `notes_count` when creating notes.
- Decrement `notes_count` when deleting notes.

### Removed

- Remove legacy `src/components/Editor.jsx` component.

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
