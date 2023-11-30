// Import necessary modules
import React, {useEffect, useState} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import socket from '../socket';
import {storage} from '../storageMkkv';
import {User} from './Interfaces';

const MyInput: React.FC<{
  label: string;
  value?: string;
  onChangeText: (v: string) => void;
}> = ({label, value, onChangeText}) => {
  return (
    <View>
      <Text>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Input Chat ID"
        style={{
          height: 50,
          width: '100%',
          borderWidth: 1,
          borderRadius: 8,
          borderColor: 'grey',
          marginTop: 8,
        }}
      />
    </View>
  );
};

const JoinChat = ({navigation}) => {
  useEffect(() => {
    const sessionID = storage.getString('sessionID');

    if (sessionID) {
      socket.auth = {sessionID};
      socket.connect();
    }

    socket.on('connect_error', err => {
      if (err.message === 'invalid username') {
        console.log('socket_err >>', err);
      }
    });
    return () => {
      socket.off('connect_error');
    };
  }, []);

  //   // Event listener for receiving messages
  //   socket.on('chat message', msg => {
  //     console.log('Received message:', msg);
  //   });

  //   // Cleanup on component unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // const sendMessage = () => {
  //   // Replace 'recipient-socket-id' with the actual recipient's socket ID
  //   const recipientId = 'recipient-socket-id';
  //   const message = 'Hello, this is a message from React Native!';

  //   // Emit a 'private message' event to the server
  //   socket.emit('private message', {recipientId, message});
  // };

  const [value, setValue] = useState<User>({
    username: '',
    name: '',
    avatar:
      'https://robohash.org/b256d0f7be4e9e1d55aef692e4642b7e?set=set4&bgset=&size=400x400',
  });

  const handlechangeValue = (key: keyof User) => (v: string) => {
    setValue(prev => ({...prev, [key]: v}));
  };

  return (
    <View style={{flex: 1, padding: 16}}>
      <MyInput
        label="Username"
        value={value?.username}
        onChangeText={handlechangeValue('username')}
      />
      <MyInput
        label="Name"
        value={value?.name}
        onChangeText={handlechangeValue('name')}
      />
      <MyInput
        label="Avatar"
        value={value?.avatar}
        onChangeText={handlechangeValue('avatar')}
      />
      <View style={{flex: 1}} />
      <Button
        title="Join Chat"
        onPress={() => {
          socket.auth = {...value};
          socket.connect();
          navigation.navigate('Chats', {user: value});
        }}
      />
    </View>
  );
};

export default JoinChat;
