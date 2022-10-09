async function get_cities_and_capitals() {
	let cities = await route_path_yaml_dict('../base/mapdata/cities.yaml');

	//console.log('cities',cities)

	let res = {}; let capitals = [];
	for (const c in cities) {
		let s = cities[c];
		let ws = s.split(',').map(x => x.trim());
		res[c] = { name: c, lon: Number(ws[0]), lat: Number(ws[1]), country: ws[2], type: ws[3], pop: Number(ws[4]) };

		if (res[c].type == 'capital') capitals.push(c);
		//`${o.lng},${o.lat},${o.country},${o.capital},${o.population}`
	}
	return [res, capitals];
}
