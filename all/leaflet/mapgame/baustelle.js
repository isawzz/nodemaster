function get_poly_center(fpoly) {

	let c2 = my_poly_center(fpoly);
	// if (c2) {
	// 	get_circle(c2, { fg: 'red' }).addTo(map); //continue;
	// } else {
	if (!c2) {
		console.log('NEIN!!!!!!!!!!!');
		let polygon = L.polygon(fpoly.geometry.coordinates);
		let bounds = polygon.getBounds();
		let center = bounds.getCenter();
		center = [center.lng, center.lat]; //for some reason vertauscht er die coords!!!
		c2 = center;
	}
	return c2;
}



function single_poly_feature(f) {
	//var polygon = L.polygon(f.geometry.coordinates);
	if (f.geometry.type == 'MultiPolygon') {
		let max_area_polygon;
		let max_area = 0;

		for (poly in (f.geometry.coordinates)) {
			let polygon1 = turf.polygon((f.geometry.coordinates)[poly])
			area = turf.area(polygon1);

			if (area > max_area) {
				max_area = area
				max_area_polygon = polygon1; // polygon with the largest area
			}
		}
		//console.log('turf',turf)
		//console.log('polymax',max_area_polygon)
		//polygon = L.polygon(max_area_polygon.geometry.coordinates);
		return max_area_polygon;
		//center = turf.centerOfMass(max_area_polygon);		
		//console.log('===>new center:',center)	
		//continue;
	} else return f;

}

function extract_polygon(f) {
	var polygon = L.polygon(f.geometry.coordinates);
	if (f.geometry.type == 'MultiPolygon') {
		let max_area_polygon;
		let max_area = 0;

		for (poly in (f.geometry.coordinates)) {
			let polygon1 = turf.polygon((f.geometry.coordinates)[poly])
			area = turf.area(polygon1);

			if (area > max_area) {
				max_area = area
				max_area_polygon = polygon1; // polygon with the largest area
			}
		}
		console.log('turf', turf)
		console.log('polymax', max_area_polygon)
		polygon = L.polygon(max_area_polygon.geometry.coordinates);
		//center = turf.centerOfMass(max_area_polygon);		
		//console.log('===>new center:',center)	
		//continue;
	}
	return polygon;
}

function my_poly_center(f) {
	let pts = points_from_feature(f);
	let c2 = get_polygon_centroid(pts);
	// console.log('c2', c2);
	if (isNaN(c2.x) || isNaN(c2.y)) return null;
	center = [c2.y, c2.x];
	//console.log('c2', center);
	return center;
}

function points_from_feature(f) {
	let coords = f.geometry.coordinates;
	let pts = [];
	//console.log('coords',coords);
	for (const c of coords[0]) {
		let p = { x: c[0], y: c[1] };
		//console.log('pt',p);
		pts.push(p);
	}
	// let pts = f.geometry.coordinates.map(p=>({x:p[0],y:p[1]}));
	//console.log('pts',pts)
	return pts;
}

function get_polygon_centroid(pts) {
	var first = pts[0], last = pts[pts.length - 1];
	if (first.x != last.x || first.y != last.y) pts.push(first);
	var twicearea = 0,
		x = 0, y = 0,
		nPts = pts.length,
		p1, p2, f;
	for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
		p1 = pts[i]; p2 = pts[j];
		f = p1.x * p2.y - p2.x * p1.y;
		twicearea += f;
		x += (p1.x + p2.x) * f;
		y += (p1.y + p2.y) * f;
	}
	f = twicearea * 3;
	return { x: x / f, y: y / f };
}














async function start0() {
	TESTING = 'nosockets'; // live | nosockets | nginx | null

	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}

	let [citylist, capitals] = [M.cities, M.capitals] = await get_cities_and_capitals();
	await load_syms();

	//style a: first of baselayer, overlay added to map
	// let map = mget_map(Geo.places.tuerkenschanzpark,19);
	// mset_bounds(2,20); 
	// mset_layers('satellite watercolor osm empty','empty labels osm');

	//style b: mach alles auf einmal
	//let map = mcreate_map({zoom: 3, base:'satellite osm watercolor',overlay:'cities labels'});

	//style c: zuerst mach die features, dann die layers, dann add layers to map

	let list = dict2list(citylist).filter(x => x.pop > 1000000 && x.type == 'capital');
	console.log('list', list);
	let cities = M.layers.cities = L.layerGroup();
	let markers = M.markers = [];

	for (const c of list) {
		let m = L.marker(c.center).bindPopup(c.name);
		addKeys(c, m);
		markers.push(m);
	}

	M.layers = {};
	cities.type == 'overlay';

	let osm = M.layers.osm = get_layer('osm', { opacity: 1, type: 'base' });
	// let satellite = M.layers.satellite = get_layer('satellite', { opacity: 1, type: 'base' });
	// let labels = M.layers.labels = get_layer('labels', { opacity: .75, type: 'overlay' });

	let map = M.map = L.map('map', { center: Geo.places.tuerkenschanzpark, zoom: 2, layers: [osm, cities] });

	//now add layer control und schau ob das funktioniert!
	var baseMaps = { osm: osm }; //, satellite: satellite };
	var overlayMaps = { cities: citylist }; //, labels: labels };
	var layerControl = M.layer_control = L.control.layers(baseMaps, overlayMaps).addTo(map);



	return;
	//********** tutorial bin bei layer control *********** */

	let players = [{ name: 'felix', city: 'Paris' }, { name: 'amanda', city: 'Vienna' }, { name: 'mimi', city: 'Madrid' }];

	M.markers = {};
	players.map(x => M.markers[x.name] = get_marker(map, citylist[x.city].center, { user: x.name, draggable: true }));

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

async function start_leaflet() {
	TESTING = 'nosockets'; // live | nosockets | nginx | null

	if (TESTING != 'nosockets') {
		Socket = TESTING == 'live' ? io('http://127.0.0.1:3000') : TESTING == 'nginx' ? io('http://216.250.112.218:3000') : io();
		Socket.on('message', x => console.log('got message', x));
		Socket.on('disconnect', x => console.log('got disconnect', x));
		Socket.on('update', x => console.log('got update', x));
	}

	var cities = L.layerGroup();

	var mLittleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities);
	var mDenver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities);
	var mAurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities);
	var mGolden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);

	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
	var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

	var streets = L.tileLayer(mbUrl, { id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr });

	var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});

	var map = L.map('map', {
		center: [39.73, -104.99],
		zoom: 10,
		layers: [osm, cities]
	});

	var baseLayers = {
		'OpenStreetMap': osm,
		'Streets': streets
	};

	var overlays = {
		'Cities': cities
	};

	var layerControl = L.control.layers(baseLayers, overlays).addTo(map);
	var crownHill = L.marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.');
	var rubyHill = L.marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');

	var parks = L.layerGroup([crownHill, rubyHill]);

	var satellite = L.tileLayer(mbUrl, { id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr });
	layerControl.addBaseLayer(satellite, 'Satellite');
	layerControl.addOverlay(parks, 'Parks');
}





