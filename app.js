const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const cors = require('cors');
app.use(cors());
//const io = new Server(server);//ohne cors reicht das:

app.use(express.static(__dirname + '')); //Serve root directory

for (const name of ['games', 'MAP99', 'mapgame']) {
	app.get('/' + name, (req, res) => {
		res.sendFile(__dirname + '/' + name + '/index.html');
	});
}


const io = new Server(server, { cors: { origins: '*', } });//live-server: brauch ich cors!
io.on('connection', (socket) => {
	handle_connect(socket.id);
	socket.on('message', handle_message);
	socket.on('update', handle_update);
	socket.on('disconnect', handle_disconnect); // ()=>handle_disconnect(socket.id));
});
function handle_connect(id) { console.log('connected', id); io.emit('message', 'someone logged in!'); }
function handle_disconnect(x) { console.log('disconnected', x); io.emit('message',x); }
function handle_message(x) { console.log('got message', x); io.emit('message', x); }
function handle_update(x){ console.log('got update', x); io.emit('update',x);}

let port = 2121;
server.listen(port, () => console.log('listening on port ' + port));