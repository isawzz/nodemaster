onload = start;

async function start() {

	dMap = mSection({w:'100%',h:'100%'},'map');

	[M.cities, M.capitals] = await get_cities_and_capitals();

	let [lat, lon] = [M.cities.Vienna.lat, M.cities.Vienna.lon];

	M.map = map_init(dMap,lat,lon,12); //console.log('Map',M.map);
	M.osm = map_add_layer('topo');

}


