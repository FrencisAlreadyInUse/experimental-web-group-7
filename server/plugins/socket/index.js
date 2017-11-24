const io = require(`socket.io`);

module.exports.name = `socket`;
module.exports.version = `1.0.0`;

module.exports.register = server => {
  const socket = io(server.listener);
  const users = {};

  socket.on(`connection`, socket => {
    const signalingServerGenerator = require(`./lib/signalingServerGenerator`);
    const ss = signalingServerGenerator(socket);

    users[socket.id] = {peers: []};

    console.log(users);

    ss.to(socket.id, `connectionUrl`, server.info.uri);
    ss.to(socket.id, `users`, users);

    ss.air(`peerConnection`, socket.id);

    ss.on(`disconnect`, () => {
      if (!users[socket.id]) return;

      notifyPeersOfDisconnect(socket.id);
      removePeerFromUsers(socket.id);

      console.log(users);
    });

    const notifyPeersOfDisconnect = socketId => {
      // send to peers that their buddy disconnected
      users[socketId].peers.forEach(peer => {
        ss.to(peer, `peerDisconnect`, socketId);
      });
    };

    const removePeerFromUsers = socketId => {
      // delete our buddy from the users object and from all other peers
      users[socketId].peers.forEach(peer => {
        if (!users[peer]) return;
        delete users[peer].peers[socketId]; // remove buddy from each peer it had
      });
      delete users[socketId]; // finally remove buddy from users
    };
  });
};
