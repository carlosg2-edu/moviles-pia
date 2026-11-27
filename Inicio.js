import {useState} from 'react';
import {Text,BottomNavigation, Appbar} from 'react-native-paper';
import Lista from './Lista';

async function openDatabase(){
  try {
    const database = await SQLite.openDatabaseAsync("gsr.db");
    db = database;

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      label TEXT,
      estado TEXT NOT NULL,
      duedate TEXT NOT NULL
    );
    `);

    return db;
  } catch (error) {
    console.error("DB init error:", error);
    db = null;
    return null;
  }
}




const Inicio = ({ refreshSignal }) => {
    const [index, setIndex] = useState(0);
    const [ScreenSignal, setScreenSignal] = useState(false);
    const increment = () => {
        setScreenSignal(!ScreenSignal)
        return ScreenSignal;
    }
    const [routes] = useState([
        {key:'entrada', title: 'Inbox', focusedIcon: 'inbox', unfocusedIcon: 'inbox-outline'},
        {key:'incubator', title: 'Incubator', focusedIcon: 'lightbulb', unfocusedIcon: 'lightbulb-outline'},
        {key:'snooze', title: 'Snooze', focusedIcon: 'sleep'},
        {key:'doable', title: 'Doable', focusedIcon: 'priority-high'},
        {key:'done', title: 'Done', focusedIcon: 'checkbox-marked', unfocusedIcon: 'checkbox-marked-outline'}
    ])

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'entrada':
                return <Lista estado="inbox" refreshSignal={refreshSignal} />;
            case 'incubator':
                return <Lista estado="incubator" refreshSignal={increment}/>;
            case 'snooze':
                return <Lista estado="snooze" refreshSignal={increment}/>;
            case 'doable':
                return <Lista estado="doable" refreshSignal={increment}/>;
            case 'done':
                return <Lista estado="done" refreshSignal={increment}/>;
            default:
                return null;
        }
    };

    return(
                <BottomNavigation
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
                />
    )
}

export default Inicio;
