import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Inicio from './Inicio';
import * as SQLite from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { initializeDatabase, addTask } from './database';
import { PaperProvider, Text, Appbar, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { View, StyleSheet, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const DAILY_TASK_REMINDER_ID = 'daily-task-reminder';
const DAILY_TASK_REMINDER_TITLE = '¡Hola! 📬';
const DAILY_TASK_REMINDER_BODY = 'Es tiempo de revisar tus tareas pendientes.';
let dailyTaskReminderPromise;

export default function App() {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(
    undefined
  );

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  
  const [nombreTarea, setNombreTarea] = useState("");
  const [labelTarea, setLabelTarea] = useState("");
  const [fechaTarea, setFechaTarea] = useState("");
  const [taskRefreshSignal, setTaskRefreshSignal] = useState(0);


  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    ensureDailyTaskReminderScheduled().catch(error => {
      console.error('Error al programar el recordatorio diario:', error);
    });

    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    let database;

    async function iniciarBaseDatos() {
      try {
        database = await SQLite.openDatabaseAsync("gsr.db");
        await initializeDatabase(database);
        setDbReady(true);
      } catch (error) {
        console.error("Error al iniciar SQLite:", error);
      }
    }

    iniciarBaseDatos();

    return () => {
      if (database) {
        database.closeAsync();
      }
    };
  }, []);

  if (!dbReady) {
    return <View style={styles.container}/>;
  }

  return (
    <PaperProvider>
        <Appbar.Header>
          <Appbar.Content title="GSR" />
          <Appbar.Action icon="plus" onPress={showDialog}/>
        </Appbar.Header>
          <Inicio refreshSignal={taskRefreshSignal} />
          <Portal>
              <Dialog
                visible={visible}
                onDismiss={hideDialog}
                style={styles.fullScreenDialog}
              >
                <Dialog.Title>Agregar tarea</Dialog.Title>
                <Dialog.Content>
                  <Text variant="bodyMedium">Introduzca el nombre de la tarea</Text>
                  <TextInput
                    label="Nombre de la tarea"
                    value={nombreTarea}
                    onChangeText={nombreTarea => setNombreTarea(nombreTarea)}
                  />
                  <Text variant="bodyMedium">Introduzca la etiqueta de la tarea</Text>
                  <TextInput
                    label="Etiqueta"
                    value={labelTarea}
                    onChangeText={labelTarea => setLabelTarea(labelTarea)}
                  />
                  <Text variant="bodyMedium">Escriba la fecha de vencimiento con estructura YYYY-MM-DD (año-mes-día)</Text>
                  <TextInput
                    label="Ejemplo: '2026-11-20'"
                    value={fechaTarea}
                    onChangeText={fechaTarea => setFechaTarea(fechaTarea)}
                  />
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={hideDialog}>Cancelar</Button>
                  <Button
                    onPress={async () => {
                      await addTask({
                        title: nombreTarea,
                        label: labelTarea,
                        duedate: fechaTarea,
                      });

                      setTaskRefreshSignal((signal) => signal + 1);
                      setNombreTarea("");
                      setLabelTarea("");
                      setFechaTarea("");
                      hideDialog();
                    }}
                  >Hecho</Button>
                </Dialog.Actions>
              </Dialog>
          </Portal>
          <StatusBar style="auto" />

      </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenDialog: {
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    margin: 3,
    borderRadius: 20,
  },
});


function ensureDailyTaskReminderScheduled() {
  if (!dailyTaskReminderPromise) {
    dailyTaskReminderPromise = scheduleDailyTaskReminder().finally(() => {
      dailyTaskReminderPromise = undefined;
    });
  }

  return dailyTaskReminderPromise;
}

async function scheduleDailyTaskReminder() {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const reminders = scheduledNotifications.filter(request => {
    const data = request.content.data;
    const isCurrentReminder = data?.reminderId === DAILY_TASK_REMINDER_ID;
    const isLegacyReminder =
      request.content.title === DAILY_TASK_REMINDER_TITLE &&
      request.content.body === DAILY_TASK_REMINDER_BODY &&
      data?.data === 'goes here' &&
      data?.test?.test1 === 'more data';

    return isCurrentReminder || isLegacyReminder;
  });

  await Promise.all(
    reminders.map(request =>
      Notifications.cancelScheduledNotificationAsync(request.identifier)
    )
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: DAILY_TASK_REMINDER_TITLE,
      body: DAILY_TASK_REMINDER_BODY,
      data: {
        data: 'goes here',
        test: { test1: 'more data' },
        reminderId: DAILY_TASK_REMINDER_ID,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 21,
      minute: 3,
    },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  // Learn more about projectId:
  // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  // Expo Services projectId is used here.
  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error('Project ID not found');
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    console.log(token);
  } catch (e) {
    token = `${e}`;
  }

  return token;
}
