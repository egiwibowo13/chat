import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import socket from '../socket';
import {User} from './Interfaces';

const SeparatorItem: React.FC<{}> = () => {
  return <View style={styles.separator} />;
};

const Chats: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const {user} = route.params;
  const {username} = user ?? {};
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    socket.emit('getUsers', {username}, (response: any) => {
      setUsers(response);
    });

    socket.on('user connected', (_user: User) => {
      setUsers((prev: User[]) => {
        return [...prev, _user];
      });
    });
  }, [username]);

  return (
    <View style={styles.container}>
      <Text>Connected Users:</Text>
      <FlatList
        data={users}
        contentContainerStyle={styles.flatlist}
        keyExtractor={item => item.userID}
        ItemSeparatorComponent={SeparatorItem}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                const selectedUser = item;
                navigation.navigate('Chat', {
                  selectedUser,
                });
              }}>
              <Image source={{uri: item.avatar}} style={styles.img} />
              <View style={styles.containerUsername}>
                <Text>{item.userID}</Text>
                <Text>{item.username}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Chats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  item: {
    marginVertical: 5,
    flexDirection: 'row',
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  containerUsername: {
    marginLeft: 16,
  },
  flatlist: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  separator: {
    height: 16,
  },
});
