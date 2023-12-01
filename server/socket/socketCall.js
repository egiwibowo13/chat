function socketSetupCall(socket, io) {

  socket.on("call", (data) => {
    let calleeId = data.calleeId;
    let rtcMessage = data.rtcMessage;

    io.to(calleeId).emit("newCall", {
      callerId: socket.userID,
      caller: {
        _id: socket.userID,
        userID: socket.userID,
        username: socket.username,
        name: socket.name,
        avatar: socket.avatar,
      },
      rtcMessage: rtcMessage,
    });
  });

  socket.on("answerCall", (data) => {
    console.log("masukk lagi ya", data.callerId)
    let callerId = data.callerId;
    rtcMessage = data.rtcMessage;

    io.to(callerId).emit("callAnswered", {
      callee: socket.userID,
      rtcMessage: rtcMessage,
    });
  });

  socket.on("ICEcandidate", (data) => {
    console.log("ICEcandidate data.calleeId", data.calleeId);
    let calleeId = data.calleeId;
    let rtcMessage = data.rtcMessage;
    console.log("socket.user emit", socket.userID);

    socket.to(calleeId).emit("ICEcandidate", {
      sender: socket.userID,
      rtcMessage: rtcMessage,
    });
  });
}

module.exports = {
  socketSetupCall
}