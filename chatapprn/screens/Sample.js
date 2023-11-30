// Import necessary modules
import React, {useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import io from 'socket.io-client';

// Replace 'http://localhost:3000' with your server address
const socket = io('http://192.168.1.3:3000');

const App = () => {
  useEffect(() => {
    // Event listener for connecting to the server
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    // Event listener for receiving messages
    socket.on('chat message', msg => {
      console.log('Received message:', msg);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    // Replace 'recipient-socket-id' with the actual recipient's socket ID
    const recipientId = 'recipient-socket-id';
    const message = 'Hello, this is a message from React Native!';

    // Emit a 'private message' event to the server
    socket.emit('private message', {recipientId, message});
  };

  return (
    <View>
      <Text>React Native Socket.IO Example</Text>
      <Button title="Send Message" onPress={sendMessage} />
    </View>
  );
};

export default App;
