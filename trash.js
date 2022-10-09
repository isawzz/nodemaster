





function create_map_click() {
	var map = L.map('map', { center: [48.2, 16.42], zoom: 13 });

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var geocodeService = L.esri.Geocoding.geocodeService();

	map.on('click', function (e) {
		geocodeService.reverse().latlng(e.latlng).run(function (error, result) {
			if (error) {
				return;
			}
			alert(result.latlng)
		});
	});
	return map;
}

function add_layer_control(map, behavior = 'pin', baseLayers = null, overlayLayers = null) {

	var button = mButton('layers', (ev) => toggle_control(map), 'dInfo');
	//behavior: open, closed, auto

	if (!baseLayers) baseLayers = get_layer_options();
	if (!overlayLayers) overlayLayers = get_layer_options();

	console.log('behavior', behavior)
	let control = L.control.layers(baseLayers, overlayLayers, { collapsed: false }).addTo(map);

	var layerscontrol = L.control.layers(baseLayers, overlays).addTo(map);

	function change_legend() {
		layerscontrol.removeFrom(map);
		overlays = {
			'CO2-Emission pro Kopf [t]': worldbankLayer,
		};
	};

	let mapcontainer = document.getElementsByClassName('leaflet-container')[0];
	let controlcontainer = document.getElementsByClassName('leaflet-control-layers')[0];
	controlcontainer.setAttribute('isOpen', true);
	console.log('control', mapcontainer, controlcontainer);
	let expanded = document.getElementsByClassName('leaflet-control-layers-expanded')[0];

	let b = mButton('close', (ev) => toggle_control(ev.target, control, controlcontainer), controlcontainer);


	// if (behavior == 'pin') {
	// 	//controlcontainer.onhover = null;
	// 	controlcontainer.onclick = () => control.expand();
	// 	expanded.ondoubleclick = () => {
	// 		let open = controlcontainer.getAttribute('isOpen');
	// 		if (open) { control.collapse(); controlcontainer.setAttribute('isOpen', false); }
	// 		else { control.expand(); controlcontainer.setAttribute('isOpen', true); }
	// 	};
	// }

	return control;

	if (behavior == 'open') {
		// resize layers control to fit into view.
		function resizeLayerControl() {
			var layerControlHeight = document.body.clientHeight - (10 + 50);
			var layerControl = document.getElementsByClassName('leaflet-control-layers-expanded')[0];
			layerControl.style.overflowY = 'auto';
			layerControl.style.maxHeight = layerControlHeight + 'px';
		}
		map.on('resize', resizeLayerControl);
		resizeLayerControl();
	}
	if (behavior == 'pin') {
		control.onclick = ev => ev.target.expand();
	}

	return control;
}
function toggle_control(button,control,controlcontainer) {
	
	let open = controlcontainer.getAttribute('isOpen');
	if (open) { control.collapse(); controlcontainer.setAttribute('isOpen', false);button.innerHTML = 'close'; }
	else { control.expand(); controlcontainer.setAttribute('isOpen', true); button.innerHTML = 'open';}

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


