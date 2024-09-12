const http = require("http");

const live = http.createServer(function (req, res) {
  res.end("hello new server");
});
live.listen(3000);
