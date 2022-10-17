
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

function dream2() {
	let o = { center: G }
	let m1 = create_map({ id: 'map' });
}
function twomaps() {
	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map').setView([48.858190, 2.294470], 16);

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// add a marker in the given location, attach some popup content to it and open the popup
	L.marker([48.858190, 2.294470]).addTo(map)
		.bindPopup('This is the Eiffel Tower<br> Easily customizable.')
		.openPopup();


	// create a map in the "map" div, set the view to a given place and zoom
	var map2 = L.map('map2').setView([48.858190, 2.294470], 16);

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map2);
}


function movepin(pin) {
	let pos = pin.getLatLng();
	pin.setLatLng([pos.lat + (coin() ? .01 : -.02), pos.lng + (coin() ? .02 : -.01)]);
}

function move_agent(a,posgetter,postransformer,possetter){
	let pos = posgetter(a);
	pos = postransformer(a,pos);
	possetter(a,pos);
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

		var polygon = extract_polygon(f);

		let bounds = polygon.getBounds();
		let center = bounds.getCenter();
		center = [center.lng, center.lat]; //for some reason vertauscht er die coords!!!

		let c2=my_poly_center(f);
		if (c2){
			get_circle(c2,{fg:'red'}).addTo(map); //continue;
		}
		// if (name == 'Amstetten' || data.features.indexOf(f) == 0){
		// 	console.log('f.geometry',f.geometry)
		// 	console.log('poly', polygon, bounds, center,center.lat,center.lng);
		// 	console.log('center', center.lat, center.lng);
		// 	console.log('c2',c2)
		// }
	

		let p = get_circle(center).addTo(map); //continue;


		var marker = L.marker(center, { opacity: 0 }); //[48.2, 16.2]);
		marker.addTo(map);
		marker.bindTooltip(f.properties.NAME_2, { direction: 'center', permanent: true, className: 'mylabel',offset: L.point({x: -30, y: 30}) }); //, className: "my-label"
	}
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

async function challenge1() {

	let data = await route_path_json('../base/mapdata/gadm36_AUT_2.json');
	// Creating map options
	var mapOptions = {
		center: [48.3, 16.3],
		zoom: 10
	}
	// Creating a map object
	var map = new L.map('map', mapOptions);

	// Creating a Layer object
	var layer = new L.TileLayer(''); //http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

	// Adding layer to the map
	map.addLayer(layer);


	// var marker = L.marker([48.3, 16.3]);// Creating a marker
	// marker.addTo(map);// Adding marker to the map

	geojson = L.geoJson(data, {}).addTo(map);


	for (const f of data.features) {

		var polygon = L.polygon(f.geometry.coordinates);
		//polygon.bindTooltip("My polygon", { permanent: true, direction: "center" }).addTo(map); //.openTooltip()		//break;
		let bounds = polygon.getBounds();
		let center = bounds.getCenter();

		let pts = points_from_feature(f);
		let c2 = get_polygon_centroid(pts);
		// console.log('c2', c2);
		if (isNaN(c2.x) || isNaN(c2.y)) continue;
		center = [c2.y, c2.x];
		console.log('c2', center);

		// continue;
		// console.log('poly', poly, bounds, center,center.lat,center.lng);
		// console.log('center', center.lat, center.lng);
		// center = [center.lng, center.lat]; //for some reason vertauscht er die coords!!!
		var marker = L.marker(center, { opacity: 0 }); //[48.2, 16.2]);
		// var marker = L.marker(c2, { opacity: 0 }); //[48.2, 16.2]);
		marker.addTo(map);
		//console.log(f.properties); //let text = f.properties.NAME_2;
		marker.bindTooltip(f.properties.NAME_2, { direction: 'center', permanent: true, className: 'mylabel' }); //, className: "my-label"
		// break;
	}

}

async function _challenge1() {

	// Creating map options
	var mapOptions = {
		center: [17.385044, 78.486671],
		zoom: 10
	}
	// Creating a map object
	var map = new L.map('map', mapOptions);

	// Creating a Layer object
	var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

	// Adding layer to the map
	map.addLayer(layer);

	// Creating a marker
	var marker = L.marker([17.385044, 78.486671]);

	// Adding marker to the map
	marker.addTo(map);

}
async function _challenge1() {

	// Creating map options
	var mapOptions = {
		center: [48.3, 16.3],
		zoom: 5
	}
	// Creating a map object
	var map = new L.map('map', mapOptions);

	// Creating a Layer object
	var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

	// Adding layer to the map
	map.addLayer(layer);

	// Creating a marker
	var marker = L.marker([48.3, 16.3]);

	// Adding marker to the map
	marker.addTo(map);

}

async function chal2() {
	let data = await route_path_json('../base/mapdata/gadm36_AUT_2.json');
	var map = L.map('map').setView([48.3, 16.3], 5);

	// var tiles = L.tileLayer('').addTo(map);
	var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	let m = L.marker([16.3, 48.3]).addTo(map);
	return;


	geojson = L.geoJson(data, {
		// style: style,
		//onEachFeature: onEachFeature,
	}).addTo(map);

	for (const f of data.features) {
		var poly = L.polygon(f.geometry.coordinates);
		let bounds = poly.getBounds();
		let center = bounds.getCenter();
		console.log('poly', poly, bounds, center);

		var marker = new L.marker(center).addTo(map); //opacity may be set to zero
		console.log(f.properties); //let text = f.properties.NAME_2;
		//marker.bindTooltip("hallo", { permanent: true, offset: [0, 0] }); //, className: "my-label"
		break;
	}
	//console.log('data',data.features)
	return;
	data.features.forEach(onEachFeature);
	return;
	states.forEach(function (state) {
		var polygon = L.polygon(state.geometry.coordinates, {
			weight: 1,
			fillOpacity: 0.7,
			color: 'white',
			dashArray: '3'
		}).addTo(map);
	});

}
function _onEachFeature(f) {
	console.log('f', f);

	//how to convert feature to polygon
	var poly = L.polygon(f.geometry.coordinates);
	let bounds = poly.getBounds();
	let center = bounds.getCenter();
	console.log('poly', poly, bounds, center);


	//how to write text only on map
	var marker = new L.marker(center, { opacity: 0 }); //opacity may be set to zero
	let text = f.properties.NAME_2;
	marker.bindTooltip("hallo", { permanent: true, offset: [0, 0] }); //, className: "my-label"
	//marker.addTo(M.map);
}



function leaflet_marker_code_samples() {

	// let marker = L.marker(center);
	//how to add my own marker: https://www.geoapify.com/create-custom-map-marker-icon
	// var myIcon = L.icon({
	// 	iconUrl: '../base/assets/users/felix.jpg',
	// 	iconSize: [30, 30],
	// 	iconAnchor: [0, 0], //x,y offset relative to top left corner of image - for tooltip
	// 	popupAnchor: [15, 0], //x,y offset relative to top left corner of image - for popup
	// 	//shadowUrl: 'my-icon-shadow.png',
	// 	//shadowSize: [68, 95],
	// 	//shadowAnchor: [22, 94]
	// });
	let sz = 25;
	myIcon = L.divIcon({
		className: 'custom-div-icon',
		html: get_img_html('../base/assets/icons/palm.png', { bg: 'red', w: sz, h: sz, border: 'solid medium yellow', rounding: '50%', box: true }),
		//html: get_user_pic_html('felix', sz, 'red solid medium'), //"<div style='background-color:#c30b82;' class='marker-pin'></div><i class='material-icons'>weekend</i>",
		//iconSize: [sz, sz],
		//iconAnchor: [2, 10],
		tooltipAnchor: [5, sz / 2 - 5],
		popupAnchor: [sz / 2 - 5, -5],
	});
	let marker = L.marker(center, { icon: myIcon }).addTo(map);

	// let tt = marker.bindTooltip('hallo!').openTooltip(); tt.addTo(map);
	let tt = marker.bindTooltip('hallo felix!!').openTooltip(); tt.addTo(map);
	let popup = marker.bindPopup('this is your start city!').openPopup(); popup.addTo(map);
}

//test loading google satellite map
//let layer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }); layer.addTo(map); return;


async function start() {
	map = L.map('map').setView([37.42, -122.05], 12);
	attrLink = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
	attrLinkToner = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';
	var terrainMap = L.tileLayer(
		'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
		attribution: attrLink,
		maxZoom: 18,
	});//.addTo(map);

	var tonerMap = L.tileLayer(
		'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		attribution: attrLinkToner,
		maxZoom: 18,
	}); //.addTo(map);

	let o = {
		name: 'Show Street Names',
		url: "http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
		layerOptions: {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
			opacity: 1,
			"showOnSelector": false,
			//detectRetina: true, // WAS MACHT DAS?????????????!!!!!!!!!!
			updateWhenIdle: true,
			reuseTiles: true
		},
		type: 'xyz',
		visible: true
	};
	var ov0 = L.tileLayer(o.url, o.layerOptions);


	var watercolorMap = L.tileLayer(
		'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
		attribution: attrLink,
		maxZoom: 18,
	}).addTo(map);

	var baseLayers = {
		"Stamen Terrain": terrainMap,
		"Stamen Toner": tonerMap,
		"Stamen Watercolor": watercolorMap
	};
	var overlays = {
		"Streets": ov0,
		"Stamen Terrain": terrainMap,
		"Stamen Toner": tonerMap,
		"Stamen Watercolor": watercolorMap
	}

	L.control.layers(baseLayers, overlays).addTo(map);
}


function toggle_streets(o) {
	o.layers.overlays.stamen_toner.visible = !o.layers.overlays.stamen_toner.visible;
}
function do_search(o) {
	if (o.queryText && o.queryText.length > 0) {
		console.log('Searching for ' + o.queryText);

		var url = "http://nominatim.openstreetmap.org/search?format=json&q=" + o.queryText;

		$http.get(url).
			success(function (data, status, headers, config) {

				console.log(data);
				o.searchResults = data;

			}).
			error(function (data, status, headers, config) {
				// log error
			});
	}

}

function hallo() {

	var map = M.map = L.map('map', { center: [48.238, 16.344], zoom: 15 });

	let o = {
		queryText: 'Paris',
		searchResults: '',
		defaults: {
			maxZoom: 16
		},
		mapCenter: {
			lat: 48.238,
			lng: 16.344,
			zoom: 15
		},
		layers: {
			baselayers: {
				stamen_watercolor: {
					name: 'watercolor',
					url: "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
					layerOptions: {
						attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
						"showOnSelector": false,
						updateWhenIdle: false,
						reuseTiles: true
					},
					type: 'xyz'
				}
			},
			overlays: {
				stamen_toner: {
					name: 'Show Street Names',
					url: "http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
					layerOptions: {
						attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
						opacity: 0.4,
						"showOnSelector": false,
						detectRetina: true,
						updateWhenIdle: true,
						reuseTiles: true
					},
					type: 'xyz',
					visible: true
				}
			}
		}

	}

	let info = o.layers.baselayers.stamen_watercolor;

	layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: ['a', 'b', 'c'] });
	layer.addTo(M.map);
}

function get_layer_satellite() {
	return L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		{ attribution: '&copy; ' + mapLink + ', ' + sourcesLink, maxZoom: 18, });


}


var muell = {
	style: [
		new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: color,
				width: 3
			}),
			fill: new ol.style.Fill({
				color: colorTrans(color, .1), //'rgba(0, 0, 255, 0.1)'
			})
		})
	]
};

function ensure_city_layer() {
	if (!lookup(M, ['layers', 'city'])) map_add_layer('city');
	return M.layers.city;
}
function map_add_city(o) {
	let layer = ensure_city_layer();
	console.log('city', o)
	let feature = map_add_circle_to_layer(o.lon, o.lat, layer);
	feature.data = o;
}

function map_add_shape(options) {
	// Create a point
	var point = new ol.geom.Point([10, 30]);
	console.log(
		"point coordinates", point.getCoordinates(),
		"extent", point.getExtent(),
		"layout", point.getLayout());

	// Create a line string
	var lineString = new ol.geom.LineString([[0, 0], [10, 0], [10, 10], [0, 10]]);
	console.log(
		"lineString coordinates", lineString.getCoordinates(),
		"extent", lineString.getExtent(),
		"layout", lineString.getLayout());

	// Create a circle
	var circle = new ol.geom.Circle([4, 5], 10);
	console.log(
		"circle center", circle.getCenter(),
		"radius", circle.getRadius(),
		"extent", circle.getExtent(),
		"layout", circle.getLayout());

	// Geometries
	var point = new ol.geom.Point(
		ol.proj.transform([3, 50], 'EPSG:4326', 'EPSG:3857')
	);
	var circle = new ol.geom.Circle(
		ol.proj.transform([2.1833, 41.3833], 'EPSG:4326', 'EPSG:3857'),
		1000000
	);

	// Features
	var pointFeature = new ol.Feature(point);
	var circleFeature = new ol.Feature(circle);

	// Source and vector layer
	var vectorSource = new ol.source.Vector({
		projection: 'EPSG:4326'
	});
	vectorSource.addFeatures([pointFeature, circleFeature]);

	var vectorLayer = new ol.layer.Vector({
		source: vectorSource
	});
}

function ol_add_circle_to_layer(longitude, latitude, layer) {
	var centerLongitudeLatitude = ol.proj.fromLonLat([longitude, latitude]);
	let source = layer.getSource();
	//console.log('source',source);
	let f = new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 14000));
	let x = source.addFeature(f);
	//console.log('result of addFeature',f);
	return f;
}

function ol_add_circle(longitude, latitude, map) {
	var centerLongitudeLatitude = ol.proj.fromLonLat([longitude, latitude]);
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 14000))]
		}),
		style: [
			new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'blue',
					width: 3
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 255, 0.1)'
				})
			})
		]
	});
	map.addLayer(layer);
}

function map_set_center(pos) {
	console.log('pos', pos);
	let di = {
		Redmond: [-122.11, 47.7],
		Vienna: [16.5, 48.2],
		NewYork: [-74.006111, 40.712778],
	};
	let center = ol.proj.fromLonLat(valf(di[pos], pos, di.Vienna));
	M.map.getView().setCenter(center); //ol.proj.transform(pos, 'EPSG:4326', 'EPSG:3857'));
}
function map_set_zoom(zoom = 12) {
	M.map.getView().setZoom(5);
}
function map_clear() {
	for (const k in M.source) { M.source[k].clear(); }
	mBy(M.options.id).innerHTML = '';
}

function fireEvent(elem, x) {
	const event = new Event(x);
	elem.addEventListener(x, (e) => { console.log('fired', x, 'on', elem) }, false);// Listen for the event.
	elem.dispatchEvent(event);// Dispatch the event.
}
function fireClick(elem) {
	if (document.createEvent) {
		console.log('erstes')
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, false);
		//console.log('fireClick: createEvent and node.dispatchEvent exist!!!', node)
		//console.log('****************fireClick: node.onclick exists!!!', node)
		//node.click();
		elem.dispatchEvent(evt);
	} else if (document.createEventObject) {
		//console.log('fireClick: createEventObject and node.fireEvent exist!!!', node)
		console.log('zweiter')

		elem.fireEvent('onclick');
	} else if (typeof elem.onclick == 'function') {
		console.log('drittes')
		//console.log('****************fireClick: node.onclick exists!!!', node)
		elem.onclick();
	}
}










