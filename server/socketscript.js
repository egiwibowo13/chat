const { Server } = require("socket.io");
const { InMemorySessionStore } = require('./sessionStore');
const { InMemoryMessageStore } = require('./messageStore');
const { randomId } = require('./utils');
let IO;

const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

module.exports.initIO = (httpServer) => {
  IO = new Server(httpServer);

  IO.use((socket, next) => {
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
    // if (socket.handshake.query) {
    //   let callerId = socket.handshake.query.callerId;
    //   socket.user = callerId;
    //   next();
    // }
  });

  IO.on("connection", (socket) => {
    socket.join(socket.user);

    socket.on("call", (data) => {
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;

      socket.to(calleeId).emit("newCall", {
        callerId: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("answerCall", (data) => {
      let callerId = data.callerId;
      rtcMessage = data.rtcMessage;

      socket.to(callerId).emit("callAnswered", {
        callee: socket.user,
        rtcMessage: rtcMessage,
      });
    });

    socket.on("ICEcandidate", (data) => {
      console.log("ICEcandidate data.calleeId", data.calleeId);
      let calleeId = data.calleeId;
      let rtcMessage = data.rtcMessage;
      console.log("socket.user emit", socket.user);

      socket.to(calleeId).emit("ICEcandidate", {
        sender: socket.user,
        rtcMessage: rtcMessage,
      });
    });
  });
};

module.exports.getIO = () => {
  if (!IO) {
    throw Error("IO not initilized.");
  } else {
    return IO;
  }
};
