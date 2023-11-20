const http = require("http");
const app = require("./app");
const socketio = require("socket.io");
const { log } = require("console");

// server setup
const server = http.createServer(app);

const io = socketio(server);

const PORT = 8000;

server.listen(PORT, () => console.log("started at port", PORT));

// socket

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("start", (creds) => {
    console.log("Started presentation", creds);
    const { username, presentationName } = creds;

    const presentationRoom = io.sockets.adapter.rooms.get(presentationName) || {
      size: 0,
    };

    let isPresenter = presentationRoom.size === 0;

    socket.join(presentationName); // presentationName -> room ID

    socket.emit("joined", {
      username,
      presentationName,
      isPresenter,
    });
  });

  socket.on("ready", (creds) => {
    console.log("ready", creds);
    socket.broadcast.to(creds.presentationName).emit("ready", creds);
  });

  socket.on('candidate', event => {
    socket.broadcast.to(event.presentationName).emit('candidate', event);
  })

  socket.on("offer", (iceData) => {
    socket.broadcast.to(iceData.presentationName).emit("offer", iceData);
  });

  socket.on("answer", (answerData) => {
    socket.broadcast.to(answerData.presentationName).emit("answer", answerData);
  });
});
