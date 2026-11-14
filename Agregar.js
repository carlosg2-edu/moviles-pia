import {SQLiteProvider} from 'expo-sqlite';
import { initializeDatabase, addTask } from './database';

export default function Agregar({ nombreTarea, labelTarea, fechaTarea }) {
  const handleAgregarTarea = async () => {
    try {
      const db = SQLiteProvider.getDatabase();
      await addTask(db, { title: nombreTarea, label: labelTarea, duedate: fechaTarea });
      console.log('Tarea agregada exitosamente');
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
    }
  }};