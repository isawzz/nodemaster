onload = start;


async function start() {

	M={};
	let text = await route_path_text('../base/mapdata/cities.csv');
	let cities = M.cities = csv2list(text);
	M.capitals = cities.filter(x=>x.capital='primary');

	//console.log('list', cities);
	map_init_OSM();

	chall4(); //cha3(cities); //challenge2(); //	challenge0();
	//map_init({url:'../base/mapdata/ecoregions.json'});
}
function chall4(){
	let caps = M.capitals;
	console.log('capitals',caps);
	let list = rChoose(caps,20);
	for(const o of list){
		map_add_city(o);
		console.log('city',o)
	}
	console.log('source', ensure_city_layer().getSource().getFeatures().map(x=>x.data.city_ascii));
}
function cha3(cities){
	let list = rChoose(cities,20);
	for(const o of list){
		map_add_city(o);
	}
	console.log('source', ensure_city_layer().getSource().getFeatures().map(x=>x.data.city_ascii));
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
function csv2list(allText, hasHeadings = true) {
	var numHeadings = 11;  // or however many elements there are in each row
	var allTextLines = allText.split(/\r\n|\n/);
	//console.log('found',allTextLines.length,'text lines!!!');
	var headings = allTextLines[0].split(',');
	numHeadings = headings.length;
	//console.log('headings',numHeadings,headings);
	let entries = allTextLines.splice(1);
	//entries = entries.slice(0,10);
	//entries.map(x=>console.log(x)); 
	var records = [];
	for (const e of entries) {
		let o = {};
		let values = e.split(',');
		for (let i = 0; i < numHeadings; i++) {
			let k = headings[i];
			o[k] = values[i];
		}
		records.push(o);
	}
	//console.log('recordsByName',recordsByName)
	return records;
}

