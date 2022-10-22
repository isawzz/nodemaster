onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	[M.cities, M.capitals] = await get_cities_and_capitals();
	test9(); //test8_load_googlemap_in_iframe(); //test7(); //test6_click(); //test5_showroute(); //test4_tools(); //test3_better_agent(); // test2_two_maps | test0_canvas_overlay
}















