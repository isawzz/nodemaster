onload = start;

function get_circle(center, styles = {}) {
	addKeys({ opacity: isdef(styles.bg) ? 1 : 0, sz: 10, fg: 'black' }, styles)
	styles = styles_to_leaflet_options(styles);
	//console.log(styles)
	styles.x = center.lon; styles.y = center.lat; styles.center = center;
	return L.circle(center, styles);
}

async function challenge1() {
	let data = await route_path_json('../base/mapdata/gadm36_AUT_2.json');
	var mapOptions = {
		center: [48.3, 16.3],
		zoom: 10
	}
	var map = new L.map('map', mapOptions);
	var layer = new L.TileLayer(''); //http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
	map.addLayer(layer);
	// var marker = L.marker([48.3, 16.3]); marker.addTo(map);// Adding marker to the map
	geojson = L.geoJson(data, {}).addTo(map);
	for (const f of data.features) {
		let name = f.properties.NAME_2;

		let fpoly = single_poly_feature(f); //this is for when it is a multipolygon!
		let center = get_poly_center(fpoly);
		let p = get_circle(center).addTo(map); //continue;


		var marker = L.marker(center, { opacity: 0 }); //[48.2, 16.2]);
		marker.addTo(map);
		marker.bindTooltip(f.properties.NAME_2, { direction: 'center', permanent: true, className: 'mylabel',offset: L.point({x: -30, y: 30}) }); //, className: "my-label"
	}
}

async function start() {

	await challenge1(); return;

	TESTING = 'nosockets'; // live | nosockets | nginx | null

	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}

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

	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery ?? <a href="https://www.mapbox.com/">Mapbox</a>';
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
















