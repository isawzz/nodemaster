
//#region data
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


//#region map

function map_init(dParent, city, zoom) {
	let o=M.cities[city];
	let center = [o.lat,o.lon];
	var map = L.map(dParent, { center: center, minZoom: 2, zoom: zoom });
	return map;
}
function map_add_layer(key = 'osm') {
	let layer;
	if (key == 'osm') {
		layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: ['a', 'b', 'c'] });
	}else if (key == 'watercolor'){
		let url = 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg';
		
	} else if (startsWith(key, 'mb')) {
		let url = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
		let id = key.includes('sat') ? 'mapbox/satellite-v9' : 'mapbox/streets-v11';
		layer = L.tileLayer(url, { id: id, tileSize: 512, zoomOffset: -1, attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>' });
	} else if (key.includes('top')) {
		layer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
			maxZoom: 22,
			attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
		});
	}

	layer.addTo(M.map);
	return layer;
}















