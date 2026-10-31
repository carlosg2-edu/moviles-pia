import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } 
from 'react-native-safe-area-context';
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "./database/database";
import Inicio from './Inicio';
import {TasksProvider} from './tasks/TasksContext';
import { Text, Appbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <SQLiteProvider
      databaseName="gtd.db"
      onInit={initializeDatabase}>
      <TasksProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Inicio/>
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
      </TasksProvider>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
