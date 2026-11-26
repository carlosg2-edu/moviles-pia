import { useState } from "react";
import * as SQLite from "expo-sqlite";
import { IconButton, Text, List, Button, Menu, Portal, Dialog} from "react-native-paper";
import { View } from "react-native";

export default function Tarea({ id, titulo, fecha, label, onChanged }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [borrarVisible, setBorrarVisible] = useState(false);
  const [editarVisible, setEditarVisible] = useState(false);

  const cerrarMenu = () => setMenuVisible(false);
  const cerrarBorrar = () => setBorrarVisible(false);
  const cerrarEditar = () => setEditarVisible(false);

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

      cerrarBorrar();
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
            leadingIcon="lightbulb"
            title="No es accionable"
            onPress={() => cambiarEstado("incubator")}
          />
          <Menu.Item
            leadingIcon="pencil"
            title="Es accionable"
            onPress={() => cambiarEstado("doable")}
          />
          <Menu.Item
            leadingIcon="sleep"
            title="Posponer"
            onPress={() => cambiarEstado("snooze")}
          />
          <Menu.Item
            leadingIcon="check"
            title="Terminada"
            onPress={() => cambiarEstado("done")}
          />
          <Menu.Item
            leadingIcon="delete"
            title="Eliminar"
            onPress={() => setBorrarVisible(true)}
          />
          <Portal>
              <Dialog visible={borrarVisible} onDismiss={cerrarBorrar}>
                <Dialog.Title>Confirmar eliminación</Dialog.Title>
                <Dialog.Content>
                  <Text>¿Está seguro de que desea eliminar esta tarea?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={cerrarBorrar}>Cancelar</Button>
                  <Button onPress={eliminarTarea}>Eliminar</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
        </Menu>
      )}
    />
  );
}