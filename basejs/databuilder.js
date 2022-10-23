
async function cities_from_csv_and_info(min = 25000) {
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

