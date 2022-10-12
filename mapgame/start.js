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

	let map = mget_map(Geo.places.tuerkenschanzpark,19);
	mset_bounds(2,20); 
	mset_layers('satellite watercolor osm empty','empty labels osm');





	return;
	//********** tutorial bin bei layer control *********** */

	let players = [{ name: 'felix', city: 'Paris' }, { name: 'amanda', city: 'Vienna' }, { name: 'mimi', city: 'Madrid' }];

	M.markers = {};
	players.map(x => M.markers[x.name] = get_marker(map, cities[x.city].center, { user: x.name, draggable: true }));

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















