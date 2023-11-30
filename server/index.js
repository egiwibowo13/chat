const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { InMemorySessionStore } = require('./sessionStore');
const { InMemoryMessageStore } = require('./messageStore');
const { randomId } = require('./utils');
const io = new Server(server);

const sessionStore = new InMemorySessionStore()
const messageStore = new InMemoryMessageStore()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      socket.name = session.name;
      socket.avatar = session.avatar;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  const name = socket.handshake.auth.name;
  const avatar = socket.handshake.auth.avatar;
  if (!username) {
    return next(new Error("invalid username"));
  }
    // create new session
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    socket.name = name;
    socket.avatar = avatar;
  next();
});

io.on("connection", (socket) => {

  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    username: socket.username,
    name: socket.name,
    avatar: socket.avatar,
  });

  socket.on("session", (args, callback) => {
    callback({
      _id: socket.userID,
      sessionID: socket.sessionID,
      userID: socket.userID,
      username: socket.username,
      name: socket.name,
      avatar: socket.avatar,
    })
  })

  socket.join(socket.userID);

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: socket.userID,
      username: socket.username,
      name: socket.name,
      avatar: socket.avatar,
    });
  }
  socket.emit("users", users);

  socket.on('getUsers', (arg, callback) => {
    const _users = [];
    for (let [id, socket] of io.of("/").sockets) {
      _users.push({
        _id: socket.userID,
        userID: socket.userID,
        username: socket.username,
        name: socket.name,
        avatar: socket.avatar,
      });
    }
    console.log("users", _users); // "users"
    callback(_users);
  })

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    name: socket.name,
    avatar: socket.avatar,
  });

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

   // notify users upon disconnection
   socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        name: socket.name,
        avatar: socket.avatar,
        connected: false,
      });
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});