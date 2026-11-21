import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, List } from "react-native-paper";
import * as SQLite from 'expo-sqlite';
import Tarea from "./Tarea";

export default function Lista({ estado = "inbox" }) {
  const [tareas, setTareas] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  async function cargarTareas() {
    const db = await SQLite.openDatabaseAsync("gsr.db");

    const filas = await db.getAllAsync(
      `
        SELECT id, title, label, estado, duedate
        FROM tasks
        WHERE estado = ?
        ORDER BY duedate ASC
      `,
      [estado]
    );

    setTareas(filas);
  }

  useEffect(() => {
    cargarTareas();
  }, [estado, refreshKey]);

  return (
    <View>
      {tareas.map((tarea) => (
        <Tarea
          key={tarea.id}
          id={tarea.id}
          titulo={tarea.title}
          fecha={tarea.duedate}
          label={tarea.label}
          onChanged={() => setRefreshKey((valor) => valor + 1)}
        />
      ))}
    </View>
  );
}