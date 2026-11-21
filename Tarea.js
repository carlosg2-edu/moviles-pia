import { useState } from "react";
import * as SQLite from "expo-sqlite";
import { IconButton, Text, List, Checkbox, Menu} from "react-native-paper";
import { View } from "react-native";

export default function Tarea({ id, titulo, fecha, label, onChanged }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const cerrarMenu = () => setMenuVisible(false);

  async function cambiarEstado(estado) {
    try {
      const db = await SQLite.openDatabaseAsync("gsr.db");

      await db.runAsync(
        "UPDATE tasks SET estado = ? WHERE id = ?",
        [estado, id]
      );

      cerrarMenu();
      onChanged?.();
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    }
  }

  async function eliminarTarea() {
    try {
      const db = await SQLite.openDatabaseAsync("gsr.db");

      await db.runAsync(
        "DELETE FROM tasks WHERE id = ?",
        [id]
      );

      cerrarMenu();
      onChanged?.();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  }

  return (
    <List.Item
      title={titulo}
      description={`Etiqueta: ${label ?? "Sin etiqueta"} | Fecha de vencimiento: ${fecha ?? "Sin fecha"}`}
      left={(props) => (
        <List.Icon {...props} icon="file-document" />
      )}
      right={() => (
        <Menu
          visible={menuVisible}
          onDismiss={cerrarMenu}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            title="No es accionable"
            onPress={() => cambiarEstado("incubator")}
          />
          <Menu.Item
            title="Es accionable"
            onPress={() => cambiarEstado("doable")}
          />
          <Menu.Item
            title="Posponer"
            onPress={() => cambiarEstado("snooze")}
          />
          <Menu.Item
            title="Marcar como hecha"
            onPress={() => cambiarEstado("done")}
          />
          <Menu.Item
            title="Eliminar tarea"
            onPress={eliminarTarea}
          />
        </Menu>
      )}
    />
  );
}