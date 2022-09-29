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

	var mousePosition = new ol.control.MousePosition({
		className: 'mousePosition',
		projection: 'EPSG:4326',
		coordinateFormat: function (coordinate) { return ol.coordinate.format(coordinate, '{y} , {x}', 6); }
	});
	map.addControl(mousePosition);

	var scaleControl = new ol.control.ScaleLine({
		bar: true,
		text: true
	});
	map.addControl(scaleControl);

	var container = document.getElementById('popup');
	var content = document.getElementById('popup-content');
	var closer = document.getElementById('popup-closer');
	
	var popup = new ol.Overlay({
			element: container,
			autoPan: true,
			autoPanAnimation: {
					duration: 250,
			},
	});
	
	map.addOverlay(popup);
	
	closer.onclick = function () {
			popup.setPosition(undefined);
			closer.blur();
			return false;
	};
	
}



