onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	await load_syms();
	test15_qa(); //test12_iconviewer(); //	test13_load_yt_in_iframe(); //test11_say();

}
function test15_qa(){
	show_available_voices();
  prompt('how are you feeling right now?',)

}
function show_available_voices(){
	say('hallo','english male',()=>console.log(DA.voicelist.map(x=>x.name)));
}
function prompt(s){

}




















