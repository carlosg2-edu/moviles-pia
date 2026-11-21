import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, List } from "react-native-paper";
import * as SQLite from 'expo-sqlite';
import Tarea from "./Tarea";

export default function Lista({ estado = "inbox" }) {
  const [tareas, setTareas] = useState([]);
  
  useEffect(() => {
    async function cargarTareas() {
      try {
        const db = await SQLite.openDatabaseAsync("gsr.db");

        const filas = await db.getAllAsync(
          `
            SELECT *
            FROM tasks
            WHERE estado = ?
            ORDER BY duedate ASC
          `,
          [estado]
        );

        setTareas(filas);
      } catch (error) {
        console.error("Error al consultar tareas:", error);
        setTareas([]);
      }
    }

    cargarTareas();
  }, [estado]);


  return (
    <View>
      {tareas.map((tarea) => (
        <Tarea
          key={tarea.id}
          titulo={tarea.title}
          etiqueta={tarea.label}
          fecha={tarea.duedate}
        />
      ))}
    </View>
  );
}