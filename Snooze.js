import { View } from "react-native";
import { Text, Snackbar, Button, Checkbox } from "react-native-paper";
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

export default function Snooze(){
    return(
        <View style={{
            padding: 20,
            backgroundColor: 'white',
            flexDirection: 'column',
            overflow: 'scroll'
        }}>
            <Lista estado="snooze"/>
        </View>
    )
}