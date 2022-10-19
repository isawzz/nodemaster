function create_agent(where, o = {}) {
	let res;
	if (is_map(where)) {
		res = L.marker(where.center).addTo(where.map);
	} else {
		res = mDiv(where, o);
	}
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
function is_map(o) { return isdef(o.map); }
function map_moveby(pin, fx, fy) {
	let pos = pin.getLatLng();
	let lat = fx(pos.lat);
	let lng = fy(pos.lng);
	pin.setLatLng([lat, lng]);
}
function map_moveto(pin, center) { pin.setLatLng(center); }



















