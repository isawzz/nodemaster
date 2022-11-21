onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	await load_syms(); dTable = mSection({h:'100%'},'dTable');
	//#region tests
	//test22_centering_container(); //test20_aspect_ratio_image_card();
	//#endregion

	let url = `http://gdata.youtube.com/feeds/api/videos`; //blocked by CORS
	let result = await route_path_text(url);
	console.log('result',result);

	let res = `
	http://gdata.youtube.com/feeds/api/videos
?v=2
&author=SesameStreet
&q=rubber+ducky
&orderby=viewCount
&start-index=1
&max-results=10
&alt=json-in-script
&callback=myCallbackFunction
&prettyprint=true
	`;
}


































