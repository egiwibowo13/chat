// io.on('connection', (socket) => {
//   console.log('a user connected');

//   // // Store the user in the connectedUsers object
//   // socket.on('setUsername', (username) => {
//   //   socket.username = username;
//   //   const currentUsers = Object.values(connectedUsers);
//   //   if (currentUsers.findIndex(i => i.username === username) === -1) {
//   //     connectedUsers[socket.id] = { id: socket.id, username };
//   //   }
//   //   io.emit('userList', Object.values(connectedUsers)); 
//   // });

//   // socket.on('getUsers', () => {
//   //   io.emit('userList', Object.values(connectedUsers)); 
//   // })

//   // socket.on('disconnect', () => {
//   //   console.log('user disconnected');
//   //   io.emit('chat message', 'selamat tinggal');
//   // });

//   // io.emit('chat message', 'Hello, everyone!');

//   // socket.on('chat message', (msg) => {
//   //   console.log('message: ' + msg);
//   //   io.emit('chat message', msg);
//   // });

//   // socket.on('private message', (data) => {
//   //   const { recipientId, message } = data;

//   //   console.log("pp >>", data)
//   //   console.log("users >>", connectedUsers)

//   //   // Store the private message
//   //   if (!privateMessages[recipientId]) {
//   //     privateMessages[recipientId] = [];
//   //   }

//   //   privateMessages[recipientId].push({
//   //     senderId: socket.id,
//   //     message: message,
//   //   });

//   //   // Send the private message to the recipient
//   //   io.to(recipientId).emit('private message', {
//   //     senderId: socket.id,
//   //     message: message,
//   //   });

//   //       // Send the private message to the recipient
//   //       io.to(socket.id).emit('private message', {
//   //         senderId: socket.id,
//   //         message: message,
//   //       });
//   // });

//   // // Request for private message history
//   // socket.on('get private messages', (recipientId) => {
//   //   const messages = privateMessages[recipientId] || [];
//   //   socket.emit('private message history', messages);
//   // });
// });
