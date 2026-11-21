import { Text, List, Checkbox} from "react-native-paper";
import { View } from "react-native";

export default function Tarea({ titulo, etiqueta, fecha }) {
  return (
    <List.Item
      title={titulo}
      description={`${etiqueta} | Fecha de vencimiento: ${fecha ?? "Sin fecha"}`}
      left={(props) => <List.Icon {...props} icon="folder" />}
    />
  );

  return null;
}