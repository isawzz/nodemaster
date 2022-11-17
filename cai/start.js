onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	await load_syms(); dTable = mBy('map'); mStyle(dTable,{family:'opensans',fz:20});//mStyle(dTable, { w: '100%', overflow: 'hidden', fz: 22 }); mCenterFlex(dTable);
	// #region tests
	//show_available_voices();
	//test15_qa();//test16_yt(); //test13_load_yt_in_iframe(); //test15_qa(); //test12_iconviewer(); //	test11_say();
	// #endregion tests
	
	//console.log('hallo');	test7_uploadfile();
	onclick=open_invisible_input;
	//onkeyup=cycle_through_editables;
}



































