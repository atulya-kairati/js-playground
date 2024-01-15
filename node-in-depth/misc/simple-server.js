const http = require("node:http");

const server = http.createServer();

server.on("request", (req, res) => {
  res.setHeader("contentType", "appliction/json");

  res.end(JSON.stringify({ name: "Manus Chaubey" }));
});

server.listen(8000, () => console.log(server.address()));
