function is_map(o) { return isdef(o.map); }
function create_agent(where,o={}){
	let res;
	if (is_map(where)){
		res = L.marker(where.center).addTo(where.map);
	}else{
		res = mDiv(where,o);
	}
	return res;
}

function create_map(o = {}) {
	//defaults: there should be a html div named 'map'
	let res = {};

	addKeys({ maxBounds: [[-89.98155760646617, -180], [89.99346179538875, 180]], key: valf(o.baselayer, 'osm'), center: Geo.places.tuerkenschanzpark, zoom: 17, id: 'map' }, o);
	addKeys(o, res);
	res.baselayer = res.key;

	res.layers = {};
	let info = Geo.layerInfo[o.key]; o.layers = [isdef(info) ? L.tileLayer(info.url, info.options) : L.tileLayer('')];
	let map = res.map = L.map(o.id, o);

	return res;
}

async function get_cities_and_capitals() {
	let cities = await route_path_yaml_dict('../base/mapdata/cities.yaml');

	//console.log('cities',cities)

	let res = {}; let capitals = [];
	for (const c in cities) {
		let s = cities[c];
		let ws = s.split(',').map(x => x.trim());
		let o = { name: c, lon: Number(ws[0]), lat: Number(ws[1]), country: ws[2], type: ws[3], pop: Number(ws[4]) };
		o.center = [o.lat, o.lon];
		if (o.type == 'capital') capitals.push(c);
		res[c] = o;
	}
	return [res, capitals];
}

function map_moveby(pin, fx, fy) {
	let pos = pin.getLatLng();
	let lat = fx(pos.lat);
	let lng = fy(pos.lng);
	pin.setLatLng([lat, lng]);
}



















