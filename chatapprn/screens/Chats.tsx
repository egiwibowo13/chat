import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import socket from '../socket';

const Chats = ({navigation, route}) => {
  const {user} = route.params;
  const {username, name, avatar} = user ?? {};
  const [users, setUsers] = useState<{userID: string; username: string}[]>([]);

  useEffect(() => {
    socket.emit('getUsers', {username}, (response: any) => {
      console.log(response); // "got it"
      setUsers(response);
    });

    socket.on('user connected', user => {
      setUsers((prev: any[]) => {
        return [...prev, user];
      });
      console.log('user >>', user);
    });
  }, [username]);

  return (
    <View>
      <Text>Connected Users:</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.userID}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={{height: 50, marginVertical: 5}}
              onPress={() => {
                const selectedUser = item;
                navigation.navigate('Chat', {
                  selectedUser,
                });
              }}>
              <Text>{item.userID}</Text>
              <Text>{item.username}</Text>
            </TouchableOpacity>
          );
        }}
      />
      {/* <TextInput
        placeholder="Enter your username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <Button title="Set Username" onPress={setUserName} /> */}
    </View>
  );
};

export default Chats;
