import Database from "@tauri-apps/plugin-sql";

let db = null;

export async function initDB() {
  if (db) return db;
  db = await Database.load("sqlite:notes.db");

  // Notebooks
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notebooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Notes
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      notebook_id INTEGER,
      name TEXT,
      content JSON,
      important BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(notebook_id) REFERENCES notebooks(id)
    )
  `);

  return db;
}

export async function addNotebook(name) {
  const database = await initDB();
  const result = await database.execute(
    "INSERT INTO notebooks (name) VALUES ($1)",
    [name],
  );
  return result?.lastInsertRowid;
}

export async function getNotebooks() {
  const database = await initDB();
  const result = await database.select("SELECT * FROM notebooks");
  return result ?? [];
}

export async function addNote(notebookId, content, important = false) {
  const database = await initDB();
  await database.execute(
    "INSERT INTO notes (notebook_id, name, content, important) VALUES ($1, $2, $3, $4)",
    [notebookId, content.name, JSON.stringify(content), important ? 1 : 0],
  );
}

export async function getNotes(notebookId) {
  const database = await initDB();
  const result = await database.select(
    "SELECT * FROM notes WHERE notebook_id = $1 ORDER BY created_at ASC",
    [notebookId],
  );
  return result ?? [];
}

export async function getNoteById(noteId) {
  const database = await initDB();
  const result = await database.select("SELECT * FROM notes WHERE id = $1", [
    noteId,
  ]);
  return result?.[0] ?? null;
}

export async function deleteNote(noteId) {
  const database = await initDB();
  await database.execute("DELETE FROM notes WHERE id = $1", [noteId]);
}

export async function deleteNotebook(notebookId) {
  const database = await initDB();
  await database.execute("DELETE FROM notes WHERE notebook_id = $1", [
    notebookId,
  ]);
  await database.execute("DELETE FROM notebooks WHERE id = $1", [notebookId]);
}

export async function updateNote(noteId, content, important = 0) {
  const database = await initDB()

  await database.execute(
    'UPDATE notes SET content = $1, important = $2 WHERE id = $3',
    [content, important ? 1 : 0, noteId]
  )
}

export async function updateNotebook(notebookId, name) {
  const database = await initDB();
  await database.execute("UPDATE notebooks SET name = $1 WHERE id = $2", [
    name,
    notebookId,
  ]);
}
