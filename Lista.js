import { View } from "react-native";
import { Text, List } from "react-native-paper";
import * as SQLite from 'expo-sqlite';
import tasks from "./data/tasks.json"
import Tarea from "./Tarea";

export default function Lista({ estado = "inbox" }) {
  return (
    <View>
      {tasks.map((tarea) => (
        <View key={tarea.id}>
          <Tarea
            estado_vista={estado}
            titulo={tarea.title}
            estado={tarea.estado}
            fecha={tarea.duedate}
          />
        </View>
      ))}
    </View>
  );
}