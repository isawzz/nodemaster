
function test11_gengraph() {
	//let items = nodes_on_div('map',30,50);	shake_and_sieve(items);
	//let space = create_space('map',)
	let items = create_nodes({x:0,y:0,w:500,h:500},20,120);
	console.log('items',items,items[120]);

	dTable = toElem('map');

	// plot_on_canvas(dTable,items);
	plot_on_div(dTable,items);

	adjacency_init(items);

	//let items = nodes_on_canvas('map',30,50);	shake_and_sieve(items);
}


// #region map tests 0
function test10_autocomplete() {
	let map = M.map = create_map({ zoom: 16 });
	map.on('moveend', function (e) { calc_map_dims(); console.log("dims", M.dims); });

	let tb = M.toolbar = create_toolbar(map);
	mButton('Dummy', dummy_reaction, tb);
	mAutocomplete(tb);

	// let city = rChoose(M.capitals);
	// console.log('city has been chosen:', city);

	// map.flyTo(Geo.cities[city].center);
}

function test9_google() {
	mBy('map').innerHTML = `
	<iframe class='flat' id="gmap" src="http://maps.google.com/maps?z=15&t=m&q=loc:48.25+16.3&output=embed" width="100%" height="${window.innerWidth}"></iframe>	
	`;
	let x = document.getElementById('gmap');
	console.log('x', x);
	mStyle(x, { bg: 'blue' });

}
function test8_load_googlemap_in_iframe() {

	var iDiv = document.createElement('iframe');
	iDiv.id = 'iframe1';
	mStyle(iDiv, { w: '100%', h: '100%' })
	document.getElementById("map").appendChild(iDiv);
	iDiv.src = 'https://maps.google.com/maps?q=48.2,16.3&output=embed';
	// iDiv.src = 'https://maps.google.com/maps?q=48.2,16.3&hl=fa;z=5&ie=UTF8&output=embed&hl=en';
}
function test7_display_dims_on_moveend() {
	let map = M.map = create_map({ zoom: 16 });
	map.on('moveend', function (e) { calc_map_dims(); console.log("dims", M.dims); });

	let city = rChoose(M.capitals);
	console.log('city has been chosen:', city);

	map.flyTo(Geo.cities[city].center);


}
function test6_click() {
	let map = M.map = create_map({ zoom: 16 });

	//calc_map_dims(); console.log('map dims',M.dims); 	return;
	add_click_set_agent();

	let tb = M.toolbar = create_toolbar(map);
	mButton('route', () => {
		map.off('click');
		let pts = M.agents.map(x => x.pos);
		//M.agents = [];
		let color = 'red';
		let callback = e => fit_points(map, pts);

		M.router = show_route(map, pts, color, callback);

	}, tb);

	mButton('clear', () => { clear_router(); clear_agents(); add_click_set_agent(); }, tb);

}

function test5_showroute() {
	let map = M.map = create_map();
	let agent = M.agent = new Agent(map, .0001, false);

	let tb = M.toolbar = create_toolbar(map);
	//mButton('route', onclick_route, tb);

	let pts = [Geo.places.tuerkenschanzpark, Geo.places.vegagasse]
	let color = 'green';
	let callback = e => fit_points(map, pts);

	let control = M.router = show_route(map, pts, color, callback);
}
function test4_tools() {
	let map = create_map();
	console.log('map', map); //map.options hat jetzt all die o params

	//return;

	// modify leaflet control container
	let d = map._controlContainer; //document.getElementsByClassName('leaflet-control-container')[0];
	console.log('control container', d);

	dMap = mDiv(d, { position: 'absolute', top: 0, left: 50, w: '100%', h: '100%' });
	dMap.style.zIndex = 12000;

	dTop = mDiv(dMap, { hmargin: 10, padding: 10, cursor: 'pointer' }, null, null, 'top'); mFlexWrap(dTop);
	let b = mButton('hallo', dummy_reaction, dTop);
	b = mButton('download', () => downloadJson({ hallo: 4343 }, '__test'), dTop);
	let a = mLink("http://duckduckgo.com", dTop, { color: 'dimgray' }, null, 'ein link');
	a = mLink("javascript:void(0)", dTop, { color: 'dimgray' }, null, 'ein link');
	a.onclick = dummy_reaction;
	b = mButton('Paris', () => map.setView(Geo.cities.Paris.center), dTop);
	b = mButton('London', () => map.flyTo(Geo.cities.London.center), dTop);//YEAH!!!!!

	let agent = new Agent(map, .0001, false); //create_agent(map);

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

//#endregion

