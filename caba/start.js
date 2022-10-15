onload = start;
TESTING = 'nosockets'; // live | nosockets | nginx | null
async function start() {
	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}

	dream0();
}


async function _start(){
	let pop = await route_path_json('../base/mapdata/populated.geojson');
	console.log('pop', pop);
	let arr = sortByFunc(pop.features, x => x.properties.nameascii);
	console.log(arr.map(x => x.properties.nameascii));
	let dipop = list2dict(arr,)
	for (const a of arr) {

	}


	let [citylist, capitals] = [M.cities, M.capitals] = await get_cities_and_capitals();
	await load_syms();
	let list = dict2list(citylist).filter(x => x.pop > 1000000 && x.type == 'capital');
	console.log('list', list);

	//for each of these cities, add all the info from pop



	let cities = L.layerGroup();
	let markers = [];
	for (const c of list) {
		let m = L.marker(c.center).bindPopup(c.name).addTo(cities);
		addKeys(c, m);
		markers.push(m);
	}

	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
	var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

	var streets = L.tileLayer(mbUrl, { id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr });

	let layers = 'osm mbsat cartodark watercolor empty labels cartolabels';
	M.layers = { cities: cities };
	toWords(layers).map(x => M.layers[x] = L.tileLayer(Geo.layerInfo[x].url, Geo.layerInfo[x].options));

	var map = M.map = L.map('map', {
		center: citylist.Vienna.center,
		zoom: 2,
		layers: [M.layers.mbsat, cities]
	});

	var baseLayers = {
		'OpenStreetMap': M.layers.osm,
		'Satellite': M.layers.mbsat,
		'Dark': M.layers.cartodark,
		'Mapbox': M.layers.watercolor,
		'Empty': M.layers.empty,
	};

	var overlays = {
		'Cities': cities,
		'Labels': M.layers.labels,
		'CartoLabels': M.layers.cartolabels,
	};

	var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

	mset_bounds(2, 19);

	var scaleControl = L.control.scale({ maxWidth: 150 }).addTo(map);
	return;

	var crownHill = L.marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.');
	var rubyHill = L.marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');
	var parks = L.layerGroup([crownHill, rubyHill]);

	var satellite = L.tileLayer(mbUrl, { id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr });
	layerControl.addBaseLayer(satellite, 'Satellite');
	layerControl.addOverlay(parks, 'Parks');
}
















