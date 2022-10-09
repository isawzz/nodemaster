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

function map_add_circle_to_layer(longitude, latitude, layer) {
	var centerLongitudeLatitude = ol.proj.fromLonLat([longitude, latitude]);
	let source = layer.getSource();
	//console.log('source',source);
	let f = new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 14000));
	let x = source.addFeature(f);
	//console.log('result of addFeature',f);
	return f;
}

function add_circle(longitude, latitude, map) {
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










