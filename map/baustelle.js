


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
function map_add_layer(options = {}) {
	let map = M.map;
	let color = valf(options.color, RED);
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [], //[new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 14000))]
		}),
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
	});
	map.addLayer(layer);
	if (isdef(options.key)) lookupSet(M, ['layers', key], layer);
	return layer;
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



















