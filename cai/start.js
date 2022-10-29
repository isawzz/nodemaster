onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}

	test0();
}

function test0(){

	//items werden mit iRegister oder iAdd


}


















