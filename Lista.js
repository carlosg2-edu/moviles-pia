import { View } from "react-native";
import { Text, List } from "react-native-paper";
import tasks from "./data/tasks.json"
import Tarea from "./Tarea";
let fs = require("fs");
export default function Lista(estado){
    
    if (estado === undefined){
        estado = "inbox";
    }
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return(
        <View>
           {
            tasks.map(tarea =>(<View>
                <Tarea estado_vista={estado} titulo={tarea.title} estado={tarea.estado} fecha={tarea.duedate}/>
            </View>))
           }
        </View>
    )
}