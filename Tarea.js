import { Text, List, Checkbox} from "react-native-paper";
import { View } from "react-native";

export default function Tarea(estado_vista, titulo, estado, fecha){
    if (estado_vista.includes(estado)){
        return(
            <List.Item
                title={titulo}
                description={"Fecha de vencimiento: ".concat(fecha)}
                left={props => <List.Icon {...props} icon="folder" />}
                />
        )
    }
    return <View></View>
}