import { List, Menu } from "react-native-paper";

export default function Tarea({
  tarea,
  onChangeStatus,
  onDelete,
}) {
  return (
    <List.Item
      title={tarea.title}
      description={`Fecha de vencimiento: ${tarea.duedate ?? "Sin fecha"}`}
      left={(props) => (
        <List.Icon {...props} icon="folder" />
      )}
      onPress={() => onChangeStatus(tarea.id, "done")}
    />
  );
}