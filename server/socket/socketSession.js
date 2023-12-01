const { InMemorySessionStore } = require('../sessionStore');
const { randomId } = require('../utils');

const sessionStore = new InMemorySessionStore()

function socketSessionMiddleware(socket, next) {
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
}

function socketSetupSession(socket) {
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
}

function saveSessionSocket(socket) {
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    name: socket.name,
    avatar: socket.avatar,
    connected: false,
  });
}

module.exports = {
    socketSessionMiddleware,
    socketSetupSession,
    saveSessionSocket
}