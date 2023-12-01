const { Server } = require("socket.io");
const {socketSessionMiddleware, socketSetupSession, saveSessionSocket} = require('./socketSession');
const {socketSetupUsers} = require('./socketUser');
const {socketSetupMessage} = require('./socketMessage');
const {socketSetupCall} = require('./socketCall');
let IO;

module.exports.initIO = (httpServer) => {
  IO = new Server(httpServer);

  IO.use(socketSessionMiddleware);

  IO.on("connection", (socket) => {
    console.log(socket.user, "Connected");
    socket.join(socket.user);

    socketSetupSession(socket);
    socketSetupUsers(socket, IO);
    socketSetupMessage(socket, IO);
    socketSetupCall(socket, IO);

       // notify users upon disconnection
   socket.on("disconnect", async () => {
    const matchingSockets = await IO.in(socket.userID).fetchSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      saveSessionSocket(socket);
    }
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
