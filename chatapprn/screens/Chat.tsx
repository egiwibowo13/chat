// // In App.js in a new project

// import React, {useState, useEffect} from 'react';
// import {View, Text, FlatList, TextInput, Button} from 'react-native';
// import socket from '../socket';

// function ChatScreen({navigation, route}) {
//   const {selectedUser} = route.params;

//   const [messages, setMessages] = useState<{content: string; from: string}[]>(
//     [],
//   );
//   const [inputMessage, setInputMessage] = useState('');

//   useEffect(() => {
//     socket.emit('getPerMessage', selectedUser, response => {
//       console.log(response);
//       setMessages(response);
//     });
//     socket.on('private message', ({content, from}) => {
//       setMessages(prev => [...prev, {content, from}]);
//     });
//   }, []);
//   return (
//     <View
//       style={{
//         flex: 1,
//         padding: 16,
//       }}>
//       <FlatList
//         data={messages}
//         renderItem={({item}) => {
//           return (
//             <Text style={{flex: 1}}>{`${item.from} - ${item.content}`}</Text>
//           );
//         }}
//       />
//       <View style={{flexDirection: 'row'}}>
//         <TextInput
//           value={inputMessage}
//           onChangeText={setInputMessage}
//           placeholder="Isi MEssage nya disini"
//           style={{
//             height: 50,
//             flex: 1,
//             borderRadius: 8,
//             borderWidth: 1,
//             borderColor: 'grey',
//             marginRight: 20,
//           }}
//         />
//         <Button
//           title="Send"
//           onPress={() => {
//             if (selectedUser) {
//               console.log('userId >>', socket.userID);
//               socket.emit('private message', {
//                 content: inputMessage,
//                 to: selectedUser.userID,
//               });
//               // this.selectedUser.messages.push({
//               //   content,
//               //   fromSelf: true,
//               // });
//               setInputMessage('');
//             }
//           }}
//         />
//       </View>
//     </View>
//   );
// }

// export default ChatScreen;

import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat, IMessage} from 'react-native-gifted-chat';
import socket from '../socket';

interface User {
  _id: string | number;
  username: string;
  name?: string;
  avatar?: string;
}

interface IMyMessage extends IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
}

const ChatScreen: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const {selectedUser} = route.params;
  const [user, setUser] = useState<User>();
  const [messages, setMessages] = useState<IMyMessage[]>([]);

  // useEffect(() => {
  //   setMessages([
  //     {
  //       _id: 1,
  //       text: 'Hello developer',
  //       createdAt: new Date(),
  //       user: {
  //         username: 'egi',
  //         _id: 'myid',
  //         name: 'React Native',
  //         avatar:
  //           'https://robohash.org/b256d0f7be4e9e1d55aef692e4642b7e?set=set4&bgset=&size=400x400',
  //       },
  //     },
  //   ]);
  // }, []);

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

  function onSend(_messages: IMyMessage[]) {
    const msg = _messages[0];
    console.log('_messages', msg);
    socket.emit('private message', {
      content: msg.text,
      to: selectedUser.userID,
    });
    // setMessages(prev => GiftedChat.append(prev, _messages));
  }

  console.log('selectedUser >>', JSON.stringify(selectedUser, null, 2));
  console.log('user >>', JSON.stringify(user, null, 2));

  return (
    <GiftedChat<IMyMessage> messages={messages} onSend={onSend} user={user} />
  );
};

export default ChatScreen;
