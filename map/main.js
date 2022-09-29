onload = start;
var map;
function start() {
	var mapView = new ol.View({
		center: ol.proj.fromLonLat([16.35, 48.22]),
		zoom: 13
	});

	map = new ol.Map({
		target: 'map',
		view: mapView,
		controls: []
	});

	var osmTile = new ol.layer.Tile({
		title: 'Open Street Map',
		visible: true,
		type: 'base',
		source: new ol.source.OSM()
	});
	map.addLayer(osmTile);

}



