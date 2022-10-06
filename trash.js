
function _map_init(options = {}) {
	//addKeys({ id: 'map-container', center: 'Vienna', zoom: isdef(options.url) ? 2 : 12, w: '100%', h: '100%', bg: DARKBLUE }, options);//, url: '../base/mapdata/ecoregions.json' }, options);
	let source = new ol.source.Vector({
		url: valf(options.url, '../base/mapdata/ecoregions.json'),
		format: new ol.format.GeoJSON(),
	});
	let style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: valf(options.color, 'beige'),
		}),
		stroke: new ol.style.Stroke({
			color: valf(options.fg, 'black'),
		}),
	});
	let layer = new ol.layer.Vector({
		source: source,
		background: valf(options.bg, DARKBLUE),
		style: function (feature) {
			let color = feature.get('COLOR');
			if (color) style.getFill().setColor(color);
			return style;
		},
	});
	return new ol.Map({
		target: 'map-container',
		layers: [layer],
		view: new ol.View({ center: ol.proj.fromLonLat([valf(options.lon, 16), valf(options.lat, 48)]), zoom: valf(options.zoom, 12), }),
	});
}
function muell() {

	addKeys({ id: 'map-container', center: 'Vienna', zoom: isdef(options.url) ? 2 : 12, w: '100%', h: '100%', bg: DARKBLUE }, options);//, url: '../base/mapdata/ecoregions.json' }, options);

	let view = new ol.View({
		//center: ol.proj.fromLonLat([16.35, 48.22]),
		//zoom: options.zoom
	});


	let style = M.styles.base = new ol.style.Style({
		fill: new ol.style.Fill({
			color: options.bg,
		}),
	});

	let source, layer;
	if (isdef(options.url)) {
		source = new ol.source.Vector({
			url: options.url,
			format: new ol.format.GeoJSON(),
		});
		layer = new ol.layer.Vector({
			source: source,
			background: options.bg,
			style: function (feature) {
				let color = feature.get('COLOR') || 'aliceblue';
				style.getFill().setColor(color);
				return style;
			},
		});
	} else {
		source = new ol.source.OSM();
		layer = new ol.layer.Tile({
			title: 'Open Street Map',
			visible: true,
			type: 'base',
			source: source,
			background: options.bg,
			style: function (feature) {
				console.log('feature', feature);
				let color = feature.get('COLOR') || 'aliceblue';
				style.getFill().setColor(color);
				return style;
			},
		});
	}

	M.layers.base = layer;

	let map = M.map = new ol.Map({
		layers: [layer],
		target: options.id,
		view: view
	});


	map_set_center(options.center);
	map_set_zoom(options.zoom);

}

function _map_init(options = {}) {

	if (M) { map_clear(); }

	addKeys({ id: 'map-container', center: 'Vienna', zoom: isdef(options.url) ? 2 : 12, w: '100%', h: '100%', bg: DARKBLUE }, options);//, url: '../base/mapdata/ecoregions.json' }, options);

	M = { options: options, map: null, layers: {}, sources: {}, styles: {}, features: {}, interactions: {}, };

	let view = new ol.View({
		//center: ol.proj.fromLonLat([16.35, 48.22]),
		//zoom: options.zoom
	});


	let style = M.styles.base = new ol.style.Style({
		fill: new ol.style.Fill({
			color: options.bg,
		}),
	});

	let source, layer;
	if (isdef(options.url)) {
		source = new ol.source.Vector({
			url: options.url,
			format: new ol.format.GeoJSON(),
		});
		layer = new ol.layer.Vector({
			source: source,
			background: options.bg,
			style: function (feature) {
				let color = feature.get('COLOR') || 'aliceblue';
				style.getFill().setColor(color);
				return style;
			},
		});
	} else {
		source = new ol.source.OSM();
		layer = new ol.layer.Tile({
			title: 'Open Street Map',
			visible: true,
			type: 'base',
			source: source,
			background: options.bg,
			style: function (feature) {
				console.log('feature', feature);
				let color = feature.get('COLOR') || 'aliceblue';
				style.getFill().setColor(color);
				return style;
			},
		});
	}

	M.layers.base = layer;

	let map = M.map = new ol.Map({
		layers: [layer],
		target: options.id,
		view: view
	});


	map_set_center(options.center);
	map_set_zoom(options.zoom);

}


