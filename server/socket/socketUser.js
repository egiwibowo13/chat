function socketSetupUsers(socket, io) {

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
    callback(_users);
  })

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    name: socket.name,
    avatar: socket.avatar,
  });
}

module.exports = {
  socketSetupUsers
}