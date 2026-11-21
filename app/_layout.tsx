import * as SQLite from 'expo-sqlite';

if (process.env.EXPO_OS === 'web') {
  SQLite.configureWeb({ wasmURL: require('../assets/wa-sqlite-fts.wasm') });
}