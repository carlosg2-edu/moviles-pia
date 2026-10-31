import {useState} from 'react';
import {Text,BottomNavigation, Appbar} from 'react-native-paper';
import Lista from './Lista';

const InboxRoute = () => <Lista/>;
const SnoozeRoute = () => <Text>2</Text>;
const DoableRoute = () => <Text>3</Text>;
const DoneRoute = () => <Text>4</Text>;

const Inicio = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key:'entrada', title: 'Entrada', focusedIcon: 'inbox', unfocusedIcon: 'inbox-outline'},
        {key:'suspenso', title: 'Snooze', focusedIcon: 'sleep'},
        {key:'doable', title: 'Doable', focusedIcon: 'pencil', unfocusedIcon: 'pencil-outline'},
        {key:'done', title: 'Done', focusedIcon: 'checkbox-marked', unfocusedIcon: 'checkbox-marked-outline'}
    ])

    const renderScene = BottomNavigation.SceneMap({
        entrada: InboxRoute,
        suspenso: SnoozeRoute,
        doable: DoableRoute,
        done: DoneRoute,
    })

    return(
                <BottomNavigation 
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
                />
    )
}

export default Inicio;