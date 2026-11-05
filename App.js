import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } 
from 'react-native-safe-area-context';
import Inicio from './Inicio';
import { PaperProvider, Text, Appbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="GSR" />
      </Appbar.Header>
        <Inicio/>
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
});
