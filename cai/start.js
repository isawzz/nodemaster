onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	//test4_save();	test5_load();	test7_uploadfile();

	//Speech = new SpeechAPI('D');
	//await load_syms();
	say(germanize('wie fuehlst du dich gerade?'),'pl',show_emos(),1,.8,.8);

}
function show_emos(){
	dTable = mBy('map');
	
}
function test7_uploadfile() {
	let o = { filename: 'ex', data: { text: 'aber geh jaaaa', id: 78912 } };

	route_post_json('http://localhost:3000/post/json', o, r => {
		dTable.children[0].innerHTML = r.checked;
		console.log(JSON.stringify(r))
	});
}

function test6_init() {

	let item = { styles: { bg: 'orange', w: 30, h: 30, round: true } };

	iInit(c1, item);
	iInit(c2, item);
	iInit(dTable, item);

	start_loop();

	//jetzt soll sich irgendwas an dem item aendern! zB die color
	setTimeout(() => item.styles.bg = BLUE, 2000);

}





















