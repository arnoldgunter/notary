# Notary

Notary is a local desktop note-taking app built with **Tauri + React + TipTap**.
It organizes content into notebooks and notes, stores data locally in SQLite, and provides a modern rich-text editor.

## Features

- Notebook management (create, rename, delete)
- Note management per notebook
- TipTap rich-text editor (including lists, headings, code, highlights, images)
- Notebook search
- Grid/List view in the explorer
- Persistence of the last opened note (via `localStorage`)
- Local SQLite storage via the Tauri SQL plugin

## Tech Stack

- **Frontend:** React 19, Vite
- **Desktop Runtime:** Tauri v2
- **Editor:** TipTap v3
- **Database:** SQLite (`@tauri-apps/plugin-sql`)
- **Styling:** CSS Modules + SCSS

## Why Tauri instead of Electron?

For Notary, Tauri is the better fit than Electron because this project focuses on a lightweight, local-first desktop app:

- **Lower resource usage:** Tauri uses system webviews instead of bundling a full Chromium runtime per app.
- **Smaller bundle size:** Builds are typically much smaller than comparable Electron apps.
- **Native Rust backend integration:** Strong foundation for performant and secure local logic.
- **Security model:** Tauri provides a restrictive capability/permission approach.

Electron is still a strong choice for very complex cross-platform desktop applications, but for Notary’s focus (local, fast, lightweight), Tauri is an excellent fit.

## Prerequisites

You need the following for development and builds:

- Node.js (LTS recommended)
- npm
- Rust Toolchain (`rustup`, `cargo`)
- Tauri v2 system dependencies for Linux (WebKitGTK, build tools)

Official setup documentation:

- https://tauri.app/start/prerequisites/

## Installation

```bash
npm install
```

## Start Development

Frontend only (Vite):

```bash
npm run dev
```

Desktop app with Tauri (including frontend + Rust):

```bash
npm run tauri dev
```

## Build

Frontend build:

```bash
npm run build
```

Native Tauri bundles:

```bash
npm run tauri build
```

## Project Structure (Short)

- `src/` – React app, UI, editor, explorer, styles
- `src/lib/db.js` – SQLite CRUD layer for notebooks/notes
- `src-tauri/` – Rust/Tauri configuration and native shell

## Data Model (Simplified)

**Table `notebooks`**

- `id`
- `name`
- `created_at`
- `notes_count`

**Table `notes`**

- `id`
- `notebook_id`
- `name`
- `content` (TipTap JSON)
- `important`
- `created_at`

## Current Workflow

1. Select or create a notebook
2. Create a note
3. Edit content in the editor (autosave via update callbacks)
4. On restart, the last opened note can be restored automatically

## Changelog

All changes are documented in `CHANGELOG.md`.
