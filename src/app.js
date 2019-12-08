const server = require("./server");

server.start(PORT => {
  console.log(`Magic is happening on port ${PORT}`);
});
