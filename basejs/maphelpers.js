const Geo = {
	layerInfo: {

		//test
		empty: {
			url: '',
			options: { maxZoom: 22 }
		},
		ru: {
			url: 'https://core-sat.maps.yandex.net/tiles?l=sat&v=3.1025.0&x={x}&y={y}&z={z}&scale=1&lang=ru_RU',
			options: { minZoom: 0, maxZoom: 19, }
		},

		//esri
		satellite: {
			url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			options: { maxZoom: 19, attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' }
		},

		//google
		gsatellite: {
			url: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
			options: { maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }
		},
		gstreets: {
			url: 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
			options: { maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }
		},
		ghybrid: {
			url: 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
			options: { maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }
		},
		gterrain: {
			url: 'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
			options: { maxZoom: 22, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }
		},

		//mapbox
		mbsat: {
			url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
			options: { attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1 }

		},

		osm: {
			url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
			options: { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: ['a', 'b', 'c'] }
		},

		//stamen
		watercolor: {
			url: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
			options: { attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.', maxZoom: 18, subdomains: 'abcd', }
		},
		labels: {
			url: "http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
			options: { attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.', maxZoom: 18 } //, detectRetina: true,}
		},
		terrain: {
			url: 'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
			options: { attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.', maxZoom: 18, }
		},
		terrainbg: {
			url: 'http://{s}.tile.stamen.com/terrain-background/{z}/{x}/{y}.jpg',
			options: { attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.', maxZoom: 18, }
		},


		topo: {
			url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
			options: {
				maxZoom: 17,
				attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
			}
		}
	}
};

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
function get_circle(center, styles = {}) {
	addKeys({ opacity: isdef(styles.bg) ? 1 : 0, sz: 10, fg: 'black' }, styles)
	styles = styles_to_leaflet_options(styles);
	//console.log(styles)
	styles.x = center.lon; styles.y = center.lat; styles.center = center;
	return L.circle(center, styles);
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
function get_layer(key, options) {
	let o = Geo.layerInfo[key];
	copyKeys(options, o.options);
	return L.tileLayer(o.url, o.options);
}

function set_map_bounds(map) {
	map.options.minZoom = 2;
	map.options.maxZoom = 15;
	var southWest = L.latLng(-89.98155760646617, -180),
		northEast = L.latLng(89.99346179538875, 180);
	var bounds = L.latLngBounds(southWest, northEast);
	map.setMaxBounds(bounds);
	map.on('drag', function () {
		map.panInsideBounds(bounds, { animate: false });
	});
}









