
function map_add_object(o, options) {
	let layer = valf(options.layer, M.map.getLayers()[0]);
	//console.log('layer', layer);
	let [lon, lat] = [valf(options.lon, o.lon, 16), valf(options.lat, o.lat, 16)];

	let shape = valf(options.shape, 'circle');

	// var f = new ol.Feature({ geometry: new ol.geom.Point([lon, lat]).transform('EPSG:4326', viewProjection), data: o, });
	// vectorLayer.addFeature(f);

	var center = ol.proj.fromLonLat([lon, lat]);
	let f = new ol.Feature({ geometry: new ol.geom.Circle(center, 14000), data: o });
	let source = layer.getSource(); let x = source.addFeature(f);
	//layer.addFeature(f);
	//console.log('result of addFeature',f);
	return f;

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
function map_init_OSM() {
	return new ol.Map({
		target: 'map-container',
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM(),
			}),
		],
		view: new ol.View({ center: ol.proj.fromLonLat([0, 0]), zoom: 2, }),
	});

}

function map_init() {
	const style = new ol.style.Style({
		fill: new ol.style.Fill({
			color: '#eeeeee',
		}),
	});

	const vector = new ol.layer.Vector({
		source: new ol.source.Vector({
			url: '../base/mapdata/countries.json',
			format: new ol.format.GeoJSON(),
		}),
		background: 'white',
		style: function (feature) {
			const color = feature.get('COLOR') || '#eeeeee';
			style.getFill().setColor(color);
			return style;
		},
	});

	const map = new ol.Map({
		layers: [vector],
		target: 'map-container',
		view: new ol.View({
			center: [0, 0],
			zoom: 2,
		}),
	});

}
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


























