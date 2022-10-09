onload = start;

async function start() {

	dMap = mSection({ w: '100%', h: '100%' }, 'map');

	[M.cities, M.capitals] = await get_cities_and_capitals();

	let map = M.map = map_init(dMap, 'Paris', 17); 

	M.baselayer = map_add_layer('watercolor');

	map.on('click', function (e) {
		document.getElementById('dInfo').innerHTML =
			"Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng + '<br>Zoom: ' + map.getZoom();
	});


}


