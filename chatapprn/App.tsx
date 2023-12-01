// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import JoinChat from './screens/JoinChat';
import Chat from './screens/Chat';
import Chats from './screens/Chats';
import Call from './screens/Call';
import socket from './socket';
import {storage} from './storageMkkv';
import {ActivityIndicator, View, TouchableOpacity, Text} from 'react-native';

const Stack = createNativeStackNavigator();

const HeaderCall: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Call', {
          otherUser: route.params.selectedUser,
          type: 'OUTGOING_CALL',
        });
      }}>
      <Text style={{color: 'green'}}>Call</Text>
    </TouchableOpacity>
  );
};

const LoadingScreen: React.FC<{}> = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator />
    </View>
  );
};

function App() {
  const [user, setUser] = React.useState<any>();
  const [otherUserCall, setOtherUserCall] = React.useState<any>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [initialRouteName, setInitialRouteName] =
    React.useState<string>('JoinChat');

  React.useEffect(() => {
    try {
      // const sessionID = storage.getString('sessionID');

      // if (sessionID) {
      //   socket.auth = {sessionID};
      //   socket.connect();
      // }

      socket.on('session', ({sessionID, userID, username}) => {
        // attach the session ID to the next reconnection attempts
        socket.auth = {sessionID};
        // store it in the localStorage
        storage.set('sessionID', sessionID);
        // save the ID of the user
        socket.userID = userID;
        setUser({sessionID, userID, username});
      });

      socket.on('newCall', ({callerId, caller, rtcMessage}) => {
        console.log('rtcMessage qweq>>', rtcMessage);
        setOtherUserCall({caller, rtcMessage});
        // setInitialRouteName('Call');
      });
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, []);

  // const initialRouteName = React.useMemo(() => {
  //   // if (loading) {
  //   //   return 'Loading';
  //   // }
  //   if (otherUserCall?.caller) {
  //     return 'Call';
  //   }
  //   if (user?.userID) {
  //     return 'Chats';
  //   }
  //   return 'JoinChat';
  // }, [user, otherUserCall]);

  // initialRout
  // console.log("masuk >>")
  // console.log("rtcMessage >>", otherUserCall?.rtcMessage)

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user?.userID ? (
          <Stack.Group>
            <Stack.Screen
              name="Chats"
              component={Chats}
              initialParams={{selectedUser: user}}
            />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={({route, navigation}) => ({
                title: route.params.selectedUser.name,
                headerRight: () => (
                  <HeaderCall navigation={navigation} route={route} />
                ),
              })}
            />
            <Stack.Screen
              name="Call"
              component={Call}
              options={({route}) => ({
                title: route.params.otherUser.name,
              })}
              initialParams={{
                type: 'INCOMING_CALL',
                otherUser: otherUserCall?.caller,
                rtcMessage: otherUserCall?.rtcMessage,
              }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="JoinChat" component={JoinChat} />
            <Stack.Screen name="Chats" component={Chats} />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={({route, navigation}) => ({
                title: route.params.selectedUser.name,
                headerRight: () => (
                  <HeaderCall navigation={navigation} route={route} />
                ),
              })}
            />
            <Stack.Screen
              name="Call"
              component={Call}
              options={({route}) => ({
                title: route.params.selectedUser.name,
              })}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
