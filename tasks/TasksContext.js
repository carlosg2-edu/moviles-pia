import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

const TasksContext = createContext(null);

export function TasksProvider({ children }) {
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);

    try {
      const result = await db.getAllAsync(`
        SELECT id, title, estado, duedate
        FROM tasks
        ORDER BY created_at DESC, id DESC
      `);

      setTasks(result);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    loadTasks().catch((error) => {
      console.error("No se pudieron cargar las tareas", error);
    });
  }, [loadTasks]);

  const addTask = useCallback(
    async ({ title, estado = "inbox", duedate = null }) => {
      const result = await db.runAsync(
        `
          INSERT INTO tasks (title, estado, duedate)
          VALUES (?, ?, ?)
        `,
        title,
        estado,
        duedate
      );

      const newTask = await db.getFirstAsync(
        `
          SELECT id, title, estado, duedate
          FROM tasks
          WHERE id = ?
        `,
        result.lastInsertRowId
      );

      setTasks((currentTasks) => [newTask, ...currentTasks]);
      return newTask;
    },
    [db]
  );

  const updateTaskStatus = useCallback(
    async (id, estado) => {
      await db.runAsync(
        "UPDATE tasks SET estado = ? WHERE id = ?",
        estado,
        id
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? { ...task, estado } : task
        )
      );
    },
    [db]
  );

  const deleteTask = useCallback(
    async (id) => {
      await db.runAsync(
        "DELETE FROM tasks WHERE id = ?",
        id
      );

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    },
    [db]
  );

  const updateTask = useCallback(
    async (id, changes) => {
      const currentTask = tasks.find((task) => task.id === id);

      if (!currentTask) {
        throw new Error(`No existe la tarea con id ${id}`);
      }

      const nextTask = {
        ...currentTask,
        ...changes,
      };

      await db.runAsync(
        `
          UPDATE tasks
          SET title = ?, estado = ?, duedate = ?
          WHERE id = ?
        `,
        nextTask.title,
        nextTask.estado,
        nextTask.duedate,
        id
      );

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? nextTask : task
        )
      );
    },
    [db, tasks]
  );

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        reloadTasks: loadTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasks debe utilizarse dentro de TasksProvider");
  }

  return context;
}