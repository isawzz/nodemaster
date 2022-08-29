onload = start;

//TESTING = true; //live-server!!! NOT in production!

async function start(){
	Socket = TESTING ? io('http://localhost:3000') : io(); //das zweite sollte gehen!

	//rotating monkey face
	await load_syms();

	let x=miPic('monkey',document.body,{position:'fixed',fz:40,left:100,top:100});
	anime({
		targets: x, //document.getElementById('hallo'),
		translateX: 250,
		rotate: '1turn',
		duration: 3000
	});

}



