
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
			if (w.includes(w1) && w.includes(land1)) {
				//console.log('found capital:',w1);
				capitals.push(o);
				o.capital = 'capital';
			}
			let name = o.name = o.city_ascii;
			if (isdef(new_cities[name]) && new_cities[name].includes('capital')) continue; // do NOT override capitals!!!
			else if (isdef(new_cities[name]) && Number(stringAfterLast(new_cities[name],','))>n) continue; // do NOT override larger cities!!!!
			new_cities[name] = `${o.lng},${o.lat},${o.country},${o.capital},${o.population}`;
		}
	}

	downloadAsYaml(new_cities, 'cities');
	return new_cities;

}

async function faicon_list(){
	let txt = await route_path_text('../base/alibs/fa.min.css');
	txt='.fa-0' + stringAfter(txt,'.fa-0');
	txt=stringBefore(txt,'sr-only');

	//let txt1=stringBefore(txt,'sr-only');	let txt2 = '.fa-monero' + stringAfter(txt,'.fa-monero');	txt= txt1 + txt2;
	//txt = await route_path_text('../caba/fa_symbols.css');

	let parts = txt.split(':before');
	console.log('parts',parts.length);
	let list=[];
	for(const p of parts){
		//console.log('p',p)
		let word = stringAfter(p,'.fa-').trim();
		//console.log('word',word);
		list.push(word);
	}
	//remove last list element!
	arrRemoveLast(list);
	list.sort();

	console.log('list',list); //list[0],list[1],list[2]);

	downloadJson({l:list},'liste');


}



















