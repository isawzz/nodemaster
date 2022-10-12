onload = start;

async function start() {
	TESTING = 'nosockets'; // live | nosockets | nginx | null

	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}

	let [cities, capitals] = await get_cities_and_capitals();
	await load_syms();

	let center = cities.Paris.center; //[47.5951,-122.1535]; //cities.Vienna.center;
	//let map = M.map = L.map('map').setView(center, 4);
	let map = M.map = L.map('map').setView([48.23413529351023, 16.346755027771], 17);

	set_map_bounds(map);

	//layers
	let baseLayers = {}, overlays = {};
	M.layers = {};
	for (const k of ['empty', 'terrainbg', 'watercolor', 'osm', 'topo', 'satellite', 'gsatellite', 'gterrain']) {
		let l = get_layer(k, { opacity: 1 });
		l.overlay = false;
		M.layers[k] = baseLayers[k] = l;
	}
	for (const k of ['labels', 'osm']) {
		let l = get_layer(k, { opacity: .5 });
		l.overlay = true;
		M.layers['ov_' + k] = overlays[k] = l;
	}

	M.layer_control = L.control.layers(baseLayers, overlays).addTo(map);
	baseLayers.osm.addTo(map);
	//console.log('layers', M.layers);

	let players = [{ name: 'felix', city: 'Paris' }, { name: 'amanda', city: 'Vienna' }, { name: 'mimi', city: 'Madrid' }];

	M.markers = {};
	players.map(x => M.markers[x.name] = get_marker(map, cities[x.city].center, { user: x.name, draggable: true }));

	//#region sample code marker, circle and on drag handler
	//sample code: add marker, add circle, signal when marker goes out of circle!
	//M.markers.nasi = get_marker(map, center, { user: 'nasi', draggable: true });
	//M.shapes = {};
	//M.shapes.nasi = get_circle(center, { sz: 1000, bg: GREEN }).addTo(map);
	//how to check where nasi marker is and if nasi marker is inside nasi shape?
	// M.markers.nasi.on('drag', function (e) {
	// 	var d = map.distance(e.latlng, M.shapes.nasi.getLatLng()); // distance between the current position of the marker and the center of the circle
	// 	var isInside = d < M.shapes.nasi.getRadius();// the marker is inside the circle when the distance is inferior to the radius
	// 	console.log('inside?', isInside ? 'YES' : 'NO');
	// 	M.shapes.nasi.setStyle({ fillColor: isInside ? 'green' : '#f03' }); // let's manifest this by toggling the color
	// });
	//#endregion

	map.on('zoomend', ev => {
		let x = ev.target;
		//console.log('zoomend x',x, typeof x, x.getZoom())
		dZoom.innerHTML = 'zoom: ' + x.getZoom();
	});

	console.log('marker in geojson: ', M.markers.felix.toGeoJSON());

	map.on('click', function (e) {
		document.getElementById('dPosition').innerHTML =
			"Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng;
	});

	L.streetView({ position: 'topleft', mapillaryId: 'RC1ZRTBfaVlhWmJmUGVqRk5CYnAxQTpmMGE3OTU0MzM0MTljZTA4' }).addTo(map);
	// Add a marker to the centre of the map
	var marker = L.marker(map.getCenter()).addTo(map);
	// Make sure the marker stays in the centre when the map is moved
	map.on('move', function () { marker.setLatLng(map.getCenter()); });


}

//buttons
function onclick_where() {
	let m = M.markers.nasi;
	console.log('m', m.getLatLng());
	console.log('nasi haus:', M.shapes.nasi)
}















