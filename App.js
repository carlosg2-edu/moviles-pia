import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } 
from 'react-native-safe-area-context';
import Inicio from './Inicio';
import { Text, Appbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Inicio/>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
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
