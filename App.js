import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Inicio from './Inicio';
import * as SQLite from 'expo-sqlite';
import { initializeDatabase, addTask } from './database';
import { PaperProvider, Text, Appbar, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';


export default function App() {
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  
  const [nombreTarea, setNombreTarea] = useState("");
  const [labelTarea, setLabelTarea] = useState("");
  const [fechaTarea, setFechaTarea] = useState("");
  const [taskRefreshSignal, setTaskRefreshSignal] = useState(0);


  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    let database;

    async function iniciarBaseDatos() {
      try {
        database = await SQLite.openDatabaseAsync("gsr.db");
        await initializeDatabase(database);
        setDbReady(true);
      } catch (error) {
        console.error("Error al iniciar SQLite:", error);
      }
    }

    iniciarBaseDatos();

    return () => {
      if (database) {
        database.closeAsync();
      }
    };
  }, []);

  if (!dbReady) {
    return <View style={styles.container}/>;
  }
  

  return (
    <PaperProvider>
        <Appbar.Header>
          <Appbar.Content title="GSR" />
          <Appbar.Action icon="plus" onPress={showDialog}/>
        </Appbar.Header>
          <Inicio refreshSignal={taskRefreshSignal} />
          <Portal>
              <Dialog
                visible={visible}
                onDismiss={hideDialog}
                style={styles.fullScreenDialog}
              >
                <Dialog.Title>Agregar tarea</Dialog.Title>
                <Dialog.Content>
                  <Text variant="bodyMedium">Introduzca el nombre de la tarea</Text>
                  <TextInput
                    label="Nombre de la tarea"
                    value={nombreTarea}
                    onChangeText={nombreTarea => setNombreTarea(nombreTarea)}
                  />
                  <Text variant="bodyMedium">Introduzca la etiqueta de la tarea</Text>
                  <TextInput
                    label="Etiqueta"
                    value={labelTarea}
                    onChangeText={labelTarea => setLabelTarea(labelTarea)}
                  />
                  <Text variant="bodyMedium">Escriba la fecha de vencimiento con estructura YYYY-MM-DD (año-mes-día)</Text>
                  <TextInput
                    label="Ejemplo: '2026-11-20'"
                    value={fechaTarea}
                    onChangeText={fechaTarea => setFechaTarea(fechaTarea)}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={hideDialog}>Cancelar</Button>
                  <Button
                    onPress={async () => {
                      await addTask({
                        title: nombreTarea,
                        label: labelTarea,
                        duedate: fechaTarea,
                      });

                      setTaskRefreshSignal((signal) => signal + 1);
                      setNombreTarea("");
                      setLabelTarea("");
                      setFechaTarea("");
                      hideDialog();
                    }}
                  >Hecho</Button>
                </Dialog.Actions>
              </Dialog>
          </Portal>
          <StatusBar style="auto" />

      </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenDialog: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    margin: 3,
    borderRadius: 20,
  },
});
