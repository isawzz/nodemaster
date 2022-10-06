onload = start;
async function start() {

	//test1_can_I_get_new_cities();	return;
	//test0_simulateClick(); //test1_can_I_get_new_cities();	//let cities = await test1_can_I_get_new_cities();
	[M.cities, M.capitals] = await get_cities_and_capitals(); //console.log('capitals', M.capitals);

	//M.map = map_init_OSM(); 	//test3_add_cities_layer(BLUE);
	let map = M.map = map_init({ url: '../base/mapdata/countries.json', colorfunc: color_by_area('phase') });
	let layer = map_add_layer();
	lookupSet(M, ['layers', 'city'], layer);

	console.log('layers', map.getLayers());
	setTimeout(onclick_cities, 500);
}

function test3_add_cities_layer(color) {
	let cities = rChoose(M.capitals, 20);

	for (const c of cities) map_add_city(M.cities[c]);
}
async function test1_can_I_get_new_cities(min = 25000) {
	let info = await route_path_yaml_dict('../base/assets/lists/info.yaml');
	let text = await route_path_text('../base/mapdata/cities.csv');
	let cities = M.cities = csv2list(text);
	let capitals = [];
	let new_cities = {};
	let num = 0;
	for (const o of cities) {
		let n = o.population;
		if (nundef(n)) continue;
		n = Number(n);
		if (n < min) continue;
		let w1 = o.city_ascii.toLowerCase();
		if (nundef(o.country)) {
			console.log('missing country', o);
			continue;
		}
		num += 1;
		let land1 = o.country.toLowerCase();
		for (const k of info.capital) {
			let w = k.toLowerCase();
			//let w2 = stringBefore(w,'-').trim();
			//let land2 = stringAfter(w,'-').trim();
			//console.log('o',w1,'k',w2);
			if (w.includes(w1) && w.includes(land1)) {
				//console.log('found capital:',w1);
				capitals.push(o);
				o.capital = 'capital';
			}
			let name = o.name = o.city_ascii;
			if (isdef(new_cities[name]) && new_cities[name].includes('capital')) continue; // do NOT override capitals!!!
			new_cities[name] = `${o.lng},${o.lat},${o.country},${o.capital},${o.population}`;
		}
	}

	downloadAsYaml(new_cities, 'cities');
	return new_cities;

}
async function test0_simulateClick() {
	let info = await route_path_yaml_dict('../base/assets/lists/info.yaml');
	downloadAsYaml(info, 'info');

}

//#region helpers

function chall4() {
	let caps = M.capitals;
	//console.log('capitals',caps);
	let list = caps; // rChoose(caps,20);
	for (const o of list) {
		map_add_city(o);
		console.log('city', o)
	}
	console.log('source', ensure_city_layer().getSource().getFeatures().map(x => x.data.city_ascii));
}
function cha3(cities) {
	let list = rChoose(cities, 20);
	for (const o of list) {
		map_add_city(o);
	}
	console.log('source', ensure_city_layer().getSource().getFeatures().map(x => x.data.city_ascii));
}
function challenge2() {
	let layer = map_add_layer('city', M.map); //,x=>Number(x.);
	let feature = map_add_circle_to_layer(16, 48, layer);
	feature.data = { hallo: 'Vienna' };
	console.log('source', layer.getSource().getFeatures());

}
function challenge1() {
	let layer = map_add_layer('city', M.map);
	map_add_circle_to_layer(16, 48, layer);

}
function challenge0() {
	for (const o of arrTake(cities, 10)) {
		//add a circle for these cities!
		console.log('o', o)
		add_circle(Number(o.lng), Number(o.lat), M.map);
	}
}









