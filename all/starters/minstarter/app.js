const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.use(express.static(__dirname + '/..')); //Serve root directory
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(4041, () => {
  console.log('listening on *:3000');
});











