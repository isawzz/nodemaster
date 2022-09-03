const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const cors = require('cors');
app.use(cors());
const io = new Server(server, { cors: { origins: '*', } });//live-server: brauch ich cors!
//const io = new Server(server);//ohne cors reicht das:

app.use(express.static(__dirname + '')); //Serve root directory
for (const name of ['','games', 'tree', 'plant']) {
	app.get('/'+name, (req, res) => {
		res.sendFile(__dirname + '/'+name+'/index.html');
	});
}


io.on('connection', (socket) => {
	console.log('a user connected');
});

let port = 2121;
server.listen(port, () => console.log('listening on port ' + port));