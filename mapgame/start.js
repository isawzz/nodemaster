onload = start;

async function start() {

	Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx'? io('http://216.250.112.218:3000') : io(); 
	Socket.on('message', x=>console.log('got message',x));
	Socket.on('disconnect', x=>console.log('got disconnect',x));
	Socket.on('update', x=>console.log('got update',x));

	let [cities, capitals] = await get_cities_and_capitals();

	let center = cities.Paris.center; //[47.5951,-122.1535]; //cities.Vienna.center;
	let map = M.map = L.map('map').setView(center, 13);

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

	M.markers = {};
	M.markers.nasi = get_marker(map, center, { user: 'nasi', tooltip: "I'm a unicorn!", draggable: true });

	M.shapes = {};
	M.shapes.nasi = get_circle(center, { sz: 1000, bg:GREEN }).addTo(map);

	//how to check where nasi marker is and if nasi marker is inside nasi shape?
	M.markers.nasi.on('drag', function (e) {
		// distance between the current position of the marker and the center of the circle
		var d = map.distance(e.latlng, M.shapes.nasi.getLatLng());

		// the marker is inside the circle when the distance is inferior to the radius
		var isInside = d < M.shapes.nasi.getRadius();

		console.log('inside?', isInside ? 'YES' : 'NO');
		// let's manifest this by toggling the color
		M.shapes.nasi.setStyle({ fillColor: isInside ? 'green' : '#f03' })
	});

}
function onclick_where() {
	let m = M.markers.nasi;
	console.log('m', m.getLatLng());
	console.log('nasi haus:', M.shapes.nasi)
}















