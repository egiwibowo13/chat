const { InMemoryMessageStore } = require('../messageStore');
const { randomId } = require('../utils');

const messageStore = new InMemoryMessageStore()

function socketSetupMessage(socket, io) {
  socket.on('getPerMessage', (args, callback) => {
    const fromUserId = args.userID;
    const userID = socket.userID;
    const messages = messageStore.findPersonalMessagesForUser(userID, fromUserId);
    callback(messages);
  })

  // private message
  socket.on("private message", ({ content, to }) => {
    const message = {
      _id: randomId(),
      text: content,
      from: socket.userID,
      createdAt: new Date(),
      user: {
        _id: socket.userID,
        username: socket.username,
        name: socket.name,
        avatar: socket.avatar,
      },
      to,
    };
    io.to(to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
  });
}

module.exports = {
  socketSetupMessage
}