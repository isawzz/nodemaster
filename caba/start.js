onload = start;
TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	let [cities, capitals] = await get_cities_and_capitals();

	//test0_maxBounds(); return;

	let o = { center: cities.Paris.center, zoom: 7, id: 'map' };
	let m1 = create_map(jsCopy(o));
	copyKeys({id:'map2',preferCanvas: true},o);
	let m2 = create_map(o);

	let a1 = create_agent(m1);
	let a2 = create_agent(m2);

	let f1 = x => x + rFloat(-.01, .05); //-.1,.1);  //rAddSubRange(.01);
	let f2 = x => x + rGaussian(-.01, .05); //-.1,.1);  //rAddSubRange(.01);
	run_for_seconds(2, () => {map_moveby(a2, f2, f2);map_moveby(a1, f1, f1);})


}
function test0_maxBounds(){
	let m1 = create_map({zoom:0});

}
















