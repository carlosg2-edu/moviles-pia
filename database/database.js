import tasksSeed from "../data/tasks.json";

export async function initializeDatabase(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      estado TEXT NOT NULL CHECK (
        estado IN ('inbox', 'doable', 'snooze', 'done')
      ),
      duedate TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const existingTask = await db.getFirstAsync(
    "SELECT id FROM tasks LIMIT 1"
  );

  if (existingTask) {
    return;
  }

  await db.withTransactionAsync(async () => {
    for (const task of tasksSeed) {
      await db.runAsync(
        `
          INSERT INTO tasks (id, title, estado, duedate)
          VALUES (?, ?, ?, ?)
        `,
        task.id,
        task.title,
        task.estado,
        task.duedate
      );
    }
  });
}