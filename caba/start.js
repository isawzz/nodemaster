onload = start; TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}
	[M.cities, M.capitals] = await get_cities_and_capitals();
	test4_tools(); //test3_better_agent(); // test2_two_maps | test0_canvas_overlay
}
function dummy_reaction(ev) { console.log('clicked', ev.target) }
function test4_tools() {
	let map = create_map();
	console.log('map', map); //map.options hat jetzt all die o params

	//return;

	// modify leaflet control container
	let d = map._controlContainer; //document.getElementsByClassName('leaflet-control-container')[0];
	console.log('control container', d);

	dMap = mDiv(d, { position: 'absolute', top: 0, left: 0, w: '100%', h: '100%' });
	dMap.style.zIndex = 12000;

	dTop = mDiv(dMap, { hmargin: 50, padding: 10, cursor: 'pointer' }, null, null, 'top'); mFlexWrap(dTop);
	let b = mButton('hallo', dummy_reaction, dTop);
	b = mButton('download', () => downloadJson({ hallo: 4343 }, '__test'), dTop);
	let a = mLink("http://duckduckgo.com", dTop, { color: 'dimgray' }, null, 'ein link');
	a = mLink("javascript:void(0)", dTop, { color: 'dimgray' }, null, 'ein link');
	a.onclick = dummy_reaction;
	b = mButton('Paris', () => map.setView(M.cities.Paris.center), dTop);
	b = mButton('London', () => map.flyTo(M.cities.London.center), dTop);//YEAH!!!!!

	//<a href="javascript:void(0)" class="closebtn">×</a>
	//jetzt 


	return;


	let x = create_toolbar(map); console.log('toolbar', x)
	let tb = x._container; console.log('toolbar', tb);

	mButton('click', () => console.log('clicked!'), tb, { cursor: 'pointer' })
	//let f=create_button(map)
}
async function test3_better_agent() {

	M = create_map();
	console.log('M', M);
	let agent = new Agent(M, .0001, false); //create_agent(map);

	//test_control0(map.map);
	let c1 = create_button(M.map, 'hallo')
	let c2 = create_button(M.map, 'h2')
	let c3 = create_button(M.map, 'h3')
	console.log('buttons', c1, c2, c3)
	//toolbartest(map.map);

}

async function test2_two_maps() {
	let [cities, capitals] = await get_cities_and_capitals();
	let o = { center: cities.Paris.center, zoom: 7, id: 'map' };
	let m1 = create_map(jsCopy(o));
	copyKeys({ id: 'map2', preferCanvas: true }, o);
	let m2 = create_map(o);

	let a1 = create_agent(m1);
	let a2 = create_agent(m2);

	let f1 = x => x + rFloat(-.01, .05);
	let f2 = x => x + rGaussian(-.01, .05); // rAddSubRange(.01);
	run_for_seconds(2, () => { map_moveby(a2, f2, f2); map_moveby(a1, f1, f1); })
}
function test1_maxBounds() { let m1 = create_map({ zoom: 0 }); }
function test0_canvas_overlay() {
	let pin = canvas_overlay();

	let f = x => x + rGaussian(-.01, .04); //-.1,.1);  //rAddSubRange(.01);
	run_for_seconds(2, () => map_moveby(pin, f, f))
}
















