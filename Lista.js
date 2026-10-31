import { ActivityIndicator, Text, View } from "react-native";
import Tarea from "./Tarea";
import { useTasks } from "./tasks/TasksContext";

export default function Lista({ estado = "inbox" }) {
  const {
    tasks,
    loading,
    updateTaskStatus,
    deleteTask,
  } = useTasks();

  const visibleTasks = tasks.filter(
    (task) => task.estado === estado
  );

  if (loading) {
    return <ActivityIndicator />;
  }

  if (visibleTasks.length === 0) {
    return (
      <View>
        <Text>No hay tareas en este estado.</Text>
      </View>
    );
  }

  return (
    <View>
      {visibleTasks.map((task) => (
        <Tarea
          key={task.id}
          tarea={task}
          onChangeStatus={updateTaskStatus}
          onDelete={deleteTask}
        />
      ))}
    </View>
  );
}