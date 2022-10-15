function mcreate_map(opts) {
	let center = M.center = valf(opts.center, Geo.places.tuerkenschanzpark);
	let zoom = M.zoom = valf(opts.zoom, 19);
	let [minzoom, maxzoom] = [M.minzoom, M.maxzoom] = [2, 19];
	let map = mget_map(center, zoom);
	mset_bounds(minzoom, maxzoom);

	mset_layers(opts.base, opts.overlay);
	return map;
}

//helpers
function mget_map(center = Geo.places.tuerkenschanzpark, zoom = 17) {
	M.center = center;
	M.zoom = zoom;
	let map = M.map = L.map('map').setView(center, zoom);
	return map;
}
function mset_bounds(minzoom = 2, maxzoom = 20) {
	//console.log('map',M.map)
	let map = M.map;
	map.options.minZoom = minzoom; // Math.min(minzoom, M.zoom);
	map.options.maxZoom = maxzoom; //Math.max(maxzoom, M.zoom);
	var southWest = L.latLng(-89.98155760646617, -180),
		northEast = L.latLng(89.99346179538875, 180);
	var bounds = L.latLngBounds(southWest, northEast);
	map.setMaxBounds(bounds);
	map.on('drag', function () {
		map.panInsideBounds(bounds, { animate: false });
	});
}
function mset_layers(base, overlay) {
	let map = M.map;
	[base, overlay] = [toWords(base), toWords(overlay)];
	let baseLayers = {}, overlays = {};
	M.layers = {};
	for (const k of base) {
		let l = _get_layer(k, { opacity: 1 });
		l.overlay = false;
		l.key = k;
		M.layers[k] = baseLayers[k] = l;
	}
	for (const k of overlay) {
		let l = get_layer(k, { opacity: .5 });
		l.overlay = true;
		l.key = k;
		M.layers['ov_' + k] = overlays[k] = l;
	}

	M.layer_control = L.control.layers(baseLayers, overlays).addTo(map);
	baseLayers[base[0]].addTo(map);
	overlays[overlay[0]].addTo(map);
	//console.log('layers', M.layers);

}
function _get_layer(key, options) {
	let o = Geo.layerInfo[key];
	if (nundef(o)) o = Geo.layerInfo.empty;
	copyKeys(options, o.options);
	return L.tileLayer(o.url, o.options);
}

function get_layer(key, options) {
	let o = Geo.layerInfo[key];
	if (nundef(o)) o = Geo.layerInfo.empty;
	copyKeys(options, o.options);
	let l = L.tileLayer(o.url, o.options);
	addKeys(options, l);
	return l;
}
function get_marker(map, center, options = {}) {

	let path;
	if (isdef(options.user)) path = '../base/assets/users/' + options.user + '.jpg';
	else if (isdef(options.icon)) path = '../base/assets/icons/' + options.icon + '.png';
	else if (isdef(options.path)) path = options.path;

	let marker;
	if (nundef(path)) {
		//return a standard leaflet marker
		marker = L.marker(center, options);
	} else {
		let [w, h] = [valf(options.w, options.sz, 50), valf(options.h, options.sz, 50)];
		addKeys({ w: w, h: h, border: `solid medium ${BLUE}`, bg: colorTrans(BLUE, .5), rounding: '50%', box: true }, options);
		let myIcon = L.divIcon({
			className: 'custom-div-icon',
			html: get_img_html(path, options), // 
			tooltipAnchor: [5, h / 4], // - 5],
			popupAnchor: [w / 2 - 5, -5],
		});
		copyKeys({ icon: myIcon }, options)
		marker = L.marker(center, options);
	}
	if (isdef(options.tooltip)) { marker.bindTooltip(options.tooltip).addTo(map); }
	if (isdef(options.tooltip)) { marker.bindPopup(options.popup).addTo(map); }
	return marker.addTo(map);
}


function styles_to_leaflet_options(o) {
	let res = {};
	let di = {
		fg: 'color', bg: 'fillColor', opacity: 'fillOpacity', sz: 'radius'
	};
	for (const k in o) {
		if (k == 'sz') o[k] /= 2;
		res[isdef(di[k]) ? di[k] : k] = o[k];
	}
	return res;
}
async function get_cities_and_capitals() {
	let cities = await route_path_yaml_dict('../base/mapdata/cities.yaml');

	//console.log('cities',cities)

	let res = {}; let capitals = [];
	for (const c in cities) {
		let s = cities[c];
		let ws = s.split(',').map(x => x.trim());
		let o = { name: c, lon: Number(ws[0]), lat: Number(ws[1]), country: ws[2], type: ws[3], pop: Number(ws[4]) };
		o.center = [o.lat, o.lon];
		if (o.type == 'capital') capitals.push(c);
		res[c] = o;
	}
	return [res, capitals];
}

function mapzeug_sample_code() {
	//#region sample code marker, circle and on drag handler
	//sample code: add marker, add circle, signal when marker goes out of circle!
	M.markers.nasi = get_marker(map, center, { user: 'nasi', draggable: true });
	M.shapes = {};
	M.shapes.nasi = get_circle(center, { sz: 1000, bg: GREEN }).addTo(map);
	// how to check where nasi marker is and if nasi marker is inside nasi shape?
	M.markers.nasi.on('drag', function (e) {
		var d = map.distance(e.latlng, M.shapes.nasi.getLatLng()); // distance between the current position of the marker and the center of the circle
		var isInside = d < M.shapes.nasi.getRadius();// the marker is inside the circle when the distance is inferior to the radius
		console.log('inside?', isInside ? 'YES' : 'NO');
		M.shapes.nasi.setStyle({ fillColor: isInside ? 'green' : '#f03' }); // let's manifest this by toggling the color
	});
	//#endregion


}







