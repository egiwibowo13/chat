// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import JoinChat from './screens/JoinChat';
import Chat from './screens/Chat';
import Chats from './screens/Chats';
import socket from './socket';
import {storage} from './storageMkkv';
import {ActivityIndicator, View} from 'react-native';

const Stack = createNativeStackNavigator();

function App() {
  const [selectedUser, setSelectedUser] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    try {
      socket.on('session', ({sessionID, userID, username}) => {
        console.log({sessionID, userID});
        // attach the session ID to the next reconnection attempts
        socket.auth = {sessionID};
        // store it in the localStorage
        storage.set('sessionID', sessionID);
        // save the ID of the user
        socket.userID = userID;
        setSelectedUser({sessionID, userID, username});
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!!selectedUser?.userID ? (
          <Stack.Group>
            <Stack.Screen
              name="Chats"
              component={Chats}
              initialParams={{selectedUser}}
            />
            <Stack.Screen name="Chat" component={Chat} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="JoinChat" component={JoinChat} />
            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen name="Chat" component={Chat} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
