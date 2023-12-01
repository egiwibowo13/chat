import React, {useState, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import socket from '../socket';
import {StyleSheet, View} from 'react-native';
import {IMyMessage, User} from './Interfaces';

const ChatScreen: React.FC<{navigation: any; route: any}> = ({
  route,
  navigation,
}) => {
  const {selectedUser} = route.params;
  const [user, setUser] = useState<User>();
  const [messages, setMessages] = useState<IMyMessage[]>([]);

  function onSend(_messages: IMyMessage[]) {
    const msg = _messages[0];
    console.log('_messages', msg);
    socket.emit('private message', {
      content: msg.text,
      to: selectedUser.userID,
    });
    // setMessages(prev => GiftedChat.append(prev, _messages));
  }

  // function onCall() {
  //   navigation.navigate('Call');
  // }

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity onPress={onCall}>
  //         <Text style={{color: 'green'}}>Call</Text>
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation, onCall]);

  useEffect(() => {
    socket.emit('getPerMessage', selectedUser, (response: IMyMessage[]) => {
      setMessages(response);
    });
    socket.emit('session', selectedUser, (response: User) => {
      setUser(response);
    });
    socket.on('private message', (message: IMyMessage) => {
      setMessages(prev => GiftedChat.append(prev, [message]));
    });
  }, [selectedUser]);

  return (
    <View style={styles.container}>
      <GiftedChat<IMyMessage> messages={messages} onSend={onSend} user={user} />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // padding: 16,
  },
});
