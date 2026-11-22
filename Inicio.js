import {useState} from 'react';
import {Text,BottomNavigation, Appbar} from 'react-native-paper';
import Lista from './Lista';

const InboxRoute = () => <Lista estado='inbox'/>;
const IncubatorRoute = () => <Lista estado='incubator'/>;
const SnoozeRoute = () => <Lista estado='snooze'/>;
const DoableRoute = () => <Lista estado='doable'/>;
const DoneRoute = () => <Lista estado='done'/>;

async function openDatabase(){
  try {
    const database = await SQLite.openDatabaseAsync("gsr.db");
    db = database;

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      label TEXT NOT NULL,
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

const addTask = async () => {
    if (!db || !title.trim()) return;

    try {
      await db.runAsync(`INSERT INTO tasks (title, label, estado, duedate) VALUES (?, ?, ?, ?); `, [
        title.trim(),
        label.trim(),
        "inbox",
        duedate.trim(),
      ]);

      setNombreTarea("");
      setLabelTarea("");
      setFechaTarea("");
      hideDialog();

    } catch (error) {
      console.error("Add error:", error);
    }
  };



const Inicio = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key:'entrada', title: 'Inbox', focusedIcon: 'inbox', unfocusedIcon: 'inbox-outline'},
        {key:'incubator', title: 'Incubator', focusedIcon: 'lightbulb', unfocusedIcon: 'lightbulb-outline'},
        {key:'snooze', title: 'Snooze', focusedIcon: 'sleep'},
        {key:'doable', title: 'Doable', focusedIcon: 'pencil', unfocusedIcon: 'pencil-outline'},
        {key:'done', title: 'Done', focusedIcon: 'checkbox-marked', unfocusedIcon: 'checkbox-marked-outline'}
    ])

    const renderScene = BottomNavigation.SceneMap({
        entrada: InboxRoute,
        incubator: IncubatorRoute,
        snooze: SnoozeRoute,
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
