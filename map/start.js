onload = start;


async function start() {

	let info = await route_path_yaml_dict('../base/assets/lists/info.yaml');
	downloadAsYaml(info,'info');
}
async function muell(){


	M = {};
	let info = await route_path_yaml_dict('../base/assets/lists/info.yaml');

	let text = await route_path_text('../base/mapdata/cities.csv');
	let cities = M.cities = csv2list(text);

	let capitals = [];
	let new_cities = {};
	let num = 0, min = 25000;
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
			new_cities[name] = `${o.lng},${o.lat},${o.country},${o.capital},${o.population}`;
		}
	}

	console.log('new cities', new_cities);
	//setTimeout(()=>downloadAsYaml(new_cities,'new_cities'),5000);
	return;
	//console.log('pop >', min, ':', num);
	//M.capitals = capitals; //cities.filter(x=>['London','Madrid','Rome'].includes(x.city_ascii)); //='primary');
	//c/onsole.log('capitals', capitals);


	//return;
	//console.log('list', cities);
	//map_init_OSM();

	//chall4(); //cha3(cities); //challenge2(); //	challenge0();
	//map_init({url:'../base/mapdata/ecoregions.json'});
}
function downloadAsYaml(o, filename) {
	let y = jsyaml.dump(o);
	downloadTextFile(y, filename, 'yaml');
}
function downloadAsText(s, filename, ext = 'txt') {
	downloadTextFile(s, filename, ext);
}
function jsonToYaml(o) {
	let y = jsyaml.dump(o);
	return y;
}
function downloadTextFile(s, filenameNoExt, ext = 'txt') {
	saveFileAtClient(
		filenameNoExt + "." + ext,
		"data:application/text",
		new Blob([s], { type: "" }));
}
function saveFileAtClient(name, type, data) {
	if (data != null && navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([data], { type: type }), name);
	let a = document.createElement('a');
	a.style.display = 'none';
	let url = window.URL.createObjectURL(new Blob([data], { type: type }));
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	fireClick(a);
	setTimeout(function () {
		// fixes firefox html removal bug
		window.URL.revokeObjectURL(url);
		a.remove();
	}, 500);
}
function _fireClick(node) {
	if (document.createEvent) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, false);
		//console.log('fireClick: createEvent and node.dispatchEvent exist!!!', node)
		//console.log('****************fireClick: node.onclick exists!!!', node)
		//node.click();
		node.dispatchEvent(evt);
	} else if (document.createEventObject) {
		//console.log('fireClick: createEventObject and node.fireEvent exist!!!', node)
		node.fireEvent('onclick');
	} else if (typeof node.onclick == 'function') {
		//console.log('****************fireClick: node.onclick exists!!!', node)
		node.onclick();
	}
}


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

