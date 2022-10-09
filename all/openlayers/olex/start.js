
onload = start;

var map;

function start() {
	const Redmond = [-122.11, 47.7];
	const Vienna = [16.5, 48.2];
	map = new ol.Map({
		target: 'map',
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM()
			})
		],
		view: new ol.View({
			center: ol.proj.fromLonLat(Redmond),
			zoom: 13
		})
	});
	var centerLongitudeLatitude = ol.proj.fromLonLat(Redmond);
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 4000))]
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

	onclick=moveview;
}


function moveview() {
	console.log('view',map.getLayers());
}















