// Import necessary modules
import React, {useEffect, useState} from 'react';
import {View, Text, Button, TextInput, StyleSheet} from 'react-native';
import socket from '../socket';
import {storage} from '../storageMkkv';
import {UserRequest} from './Interfaces';

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
        style={styles.textInput}
      />
    </View>
  );
};

const JoinChat: React.FC<{navigation: any}> = ({navigation}) => {
  useEffect(() => {
    // const sessionID = storage.getString('sessionID');

    // if (sessionID) {
    //   socket.auth = {sessionID};
    //   socket.connect();
    // }

    socket.on('connect_error', err => {
      if (err.message === 'invalid username') {
        console.log('socket_err >>', err);
      }
    });
    return () => {
      socket.off('connect_error');
    };
  }, []);

  const [value, setValue] = useState<UserRequest>({
    username: '',
    name: '',
    avatar:
      'https://robohash.org/b256d0f7be4e9e1d55aef692e4642b7e?set=set4&bgset=&size=400x400',
  });

  const handlechangeValue = (key: keyof UserRequest) => (v: string) => {
    setValue(prev => ({...prev, [key]: v}));
  };

  return (
    <View style={styles.container}>
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
      <View style={styles.spacer} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  textInput: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'grey',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  spacer: {
    flex: 1,
  },
});
