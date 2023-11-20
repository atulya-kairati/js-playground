const http = require("http");
const app = require("./app.js");

const PORT = 3000;

const server = http.createServer(app);

// since we passed server, it also handles '/socket.io/socket.io.js' in html
const io = require("socket.io")(server);

server.listen(PORT, () => {
  console.log("listening on", PORT);
});

io.on("connection", (socket) => {
  console.log("User connected", socket.handshake.query);
  socket.on("create or join", (room) => {
    console.log("create or join", room);

    const myRoom = io.sockets.adapter.rooms.get(room) || { size: 0 };
    const noOfClients = myRoom.size;

    console.log(room, "has clients:", noOfClients);
    console.log(myRoom);

    io.fetchSockets().then((s) => {
      s.forEach(e => {
        console.log('>>>>>>>>>>>>', e.id);
        e.emit('junk', `your id: ${e.id}`)
      });

    });

    if (noOfClients == 0) {
      socket.emit("created", room);
      socket.join(room);
    } else if (noOfClients == 1) {
      socket.emit("joined", room);
      socket.join(room);
    } else {
      socket.emit("full", room);
    }
  });

  socket.on("ready", (room) => {
    socket.broadcast.to(room).emit("ready");
  });

  socket.on("candidate", (event) => {
    socket.broadcast.to(event.room).emit("candidate", event);
  });

  socket.on("offer", (event) => {
    socket.broadcast.to(event.room).emit("offer", event.sdp);
  });

  socket.on("answer", (event) => {
    socket.broadcast.to(event.room).emit("answer", event.sdp);
  });
});
