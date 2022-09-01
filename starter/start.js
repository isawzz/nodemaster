onload = start;

TESTING = 'live'; // live | nginx | [false] | true (live for live-server, nginx for nginx) 

async function start() {

	Socket = TESTING == 'live' ? io('http://localhost:2121') : TESTING == 'nginx'? io('http://216.250.112.218:3000') : io(); 

	//rotating monkey
	await load_syms();
	let x = miPic('monkey', document.body, { position: 'fixed', fz: 40, left: 100, top: 100 });
	anime({ targets: x, translateX: 250, rotate: '1turn', duration: 3000 });

}



