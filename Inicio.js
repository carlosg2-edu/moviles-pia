import {useState} from 'react';
import {Text,BottomNavigation, Appbar} from 'react-native-paper';
import Lista from './Lista';

const InboxRoute = () => <Lista estado="inbox" />;
const SnoozeRoute = () => <Lista estado="snooze" />;
const DoableRoute = () => <Lista estado="doable" />;
const DoneRoute = () => <Lista estado="done" />;

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