onload = start;

function start() {
	let background = 'midnightblue';
	M = { map: null, layer: null, source: null, style: null, feature: null, interactions: {}, };
	let style = M.style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: background,
		}),
	});

	let source = M.source = new ol.source.Vector({
		url: '../base/mapdata/ecoregions.json',
		format: new ol.format.GeoJSON(),
	});

	let layer = M.layer = new ol.layer.Vector({
		source:source,
		background: background,
		style: function (feature) {
			//console.log('features',feature.values_)
			let color = feature.get('COLOR') || background;
			M.style.getFill().setColor(color);
			return style;
		},
	});

	let map = M.map = new ol.Map({
		layers: [layer],
		target: 'map-container',
		view: new ol.View({
			center: [0, 0],
			zoom: 2,
		}),
	});

	console.log('M',M);//da sind lauter komische variables drin!!!

}
