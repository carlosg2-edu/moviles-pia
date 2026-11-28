import { useState } from "react";
import * as SQLite from "expo-sqlite";
import { IconButton, Text, TextInput, List, Button, Menu, Portal, Dialog } from "react-native-paper";

export default function Tarea({ id, titulo, fecha, label, onChanged }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [borrarVisible, setBorrarVisible] = useState(false);
  const [editarVisible, setEditarVisible] = useState(false);
  const [tituloEditado, setTituloEditado] = useState("");
  const [labelEditado, setLabelEditado] = useState("");
  const [fechaEditada, setFechaEditada] = useState("");
  const [errorEdicion, setErrorEdicion] = useState("");

  const cerrarMenu = () => setMenuVisible(false);
  const cerrarBorrar = () => setBorrarVisible(false);
  const cerrarEditar = () => setEditarVisible(false);

  function abrirEdicion() {
    setTituloEditado(titulo ?? "");
    setLabelEditado(label ?? "");
    setFechaEditada(fecha ?? "");
    setErrorEdicion("");
    cerrarMenu();
    setEditarVisible(true);
  }

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

  async function guardarEdicion() {
    const tituloLimpio = tituloEditado.trim();
    if (!tituloLimpio) {
      setErrorEdicion("El título es obligatorio.");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync("gsr.db");

      const result = await db.runAsync(
        "UPDATE tasks SET title = ?, label = ?, duedate = ? WHERE id = ?",
        [tituloLimpio, labelEditado.trim(), fechaEditada.trim(), id]
      );

      if (result.changes === 0) {
        throw new Error(`No se encontró la tarea con id ${id}.`);
      }

      cerrarEditar();
      onChanged?.();
    } catch (error) {
      console.error("Error al editar la tarea:", error);
      setErrorEdicion("No se pudo guardar la tarea. Inténtelo de nuevo.");
    }
  }

  return (
    <List.Item
      title={titulo}
      description={`Etiqueta: ${(label.trim()) ? label : "Sin etiqueta"} | Fecha de vencimiento: ${(fecha.trim()) ? fecha : "Sin fecha"}`}
      left={(props) => (
        <List.Icon {...props} icon="file-document" />
      )}
      right={() => (
        <>
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
              leadingIcon="pencil"
              title="Editar"
              onPress={abrirEdicion}
            />
            <Menu.Item
              leadingIcon="lightbulb"
              title="No es accionable"
              onPress={() => cambiarEstado("incubator")}
            />
            <Menu.Item
              leadingIcon="priority-high"
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
          </Menu>
          <Portal>
            <Dialog visible={editarVisible} onDismiss={cerrarEditar}>
              <Dialog.Title>Editar tarea</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Nombre de la tarea"
                  value={tituloEditado}
                  onChangeText={setTituloEditado}
                />
                <TextInput
                  label="Etiqueta"
                  value={labelEditado}
                  onChangeText={setLabelEditado}
                />
                <TextInput
                  label="Fecha de vencimiento (YYYY-MM-DD)"
                  value={fechaEditada}
                  onChangeText={setFechaEditada}
                />
                {errorEdicion ? <Text>{errorEdicion}</Text> : null}
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={cerrarEditar}>Cancelar</Button>
                <Button onPress={guardarEdicion}>Guardar</Button>
              </Dialog.Actions>
            </Dialog>
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
        </>
      )}
    />
  );
}