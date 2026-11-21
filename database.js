import * as SQLite from 'expo-sqlite';

export async function initializeDatabase(db) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      title TEXT NOT NULL,
      label TEXT NOT NULL,
      estado TEXT NOT NULL,
      duedate TEXT NOT NULL
    );
  `);
}

export async function addTask({ title, label, estado = 'inbox', duedate}) {
  const db = await SQLite.openDatabaseAsync("gsr.db");
  if (!title || title.trim().length === 0) {
    throw new Error('El título de la tarea es obligatorio.');
  }
  if (!label || label.trim().length === 0) {
    throw new Error('Debe darle una etiqueta a la tarea.');
  }

  const result = await db.runAsync(
    `
      INSERT INTO tasks (title, label, estado, duedate)
      VALUES (?, ?, ?, ?)
    `,
    title.trim(),
    label,
    estado,
    duedate
  );
  console.log("Tarea agregada con éxito:", result);
  return {
    id: result.lastInsertRowId,
    title: title.trim(),
    label,
    estado,
    duedate,
  };
  
}

export async function getTasksByStatus(db, estado) {
  return db.getAllAsync(
    `
      SELECT id, title, label, estado, duedate
      FROM tasks
      WHERE estado = ?
      ORDER BY duedate ASC
    `,
    [estado]
  );
}

export async function changeTaskStatus(db, taskId, estado) {
  if (!taskId) {
    throw new Error('El identificador de la tarea es obligatorio.');
  }

  if (!estado || estado.trim().length === 0) {
    throw new Error('El estado de la tarea es obligatorio.');
  }

  const result = await db.runAsync(
    `
      UPDATE tasks
      SET estado = ?
      WHERE id = ?
    `,
    estado.trim(),
    taskId
  );

  if (result.changes === 0) {
    throw new Error(`No se encontró la tarea con id ${taskId}.`);
  }

  return result.changes;
}

export async function deleteTask(db, taskId) {
  if (!taskId) {
    throw new Error('El identificador de la tarea es obligatorio.');
  }

  const result = await db.runAsync(
    `
      DELETE FROM tasks
      WHERE id = ?
    `,
    taskId
  );

  if (result.changes === 0) {
    throw new Error(`No se encontró la tarea con id ${taskId}.`);
  }

  return result.changes;
}