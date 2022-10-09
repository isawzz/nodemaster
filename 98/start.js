onload = start;
async function start() {
	map = L.map('map').setView([37.42, -122.05], 12);
	attrLink = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
	attrLinkToner = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.';
	var terrainMap = L.tileLayer(
		'http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
		attribution: attrLink,
		maxZoom: 18,
	});//.addTo(map);

	var tonerMap = L.tileLayer(
		'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
		attribution: attrLinkToner,
		maxZoom: 18,
	}); //.addTo(map);

	let o = {
		name: 'Show Street Names',
		url: "http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
		layerOptions: {
			attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
			opacity: 1,
			"showOnSelector": false,
			//detectRetina: true, // WAS MACHT DAS?????????????!!!!!!!!!!
			updateWhenIdle: true,
			reuseTiles: true
		},
		type: 'xyz',
		visible: true
	};
	var ov0 = L.tileLayer(o.url, o.layerOptions);


	var watercolorMap = L.tileLayer(
		'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
		attribution: attrLink,
		maxZoom: 18,
	}).addTo(map);

	var baseLayers = {
		"Stamen Terrain": terrainMap,
		"Stamen Toner": tonerMap,
		"Stamen Watercolor": watercolorMap
	};
	var overlays = {
		"Streets": ov0,
		"Stamen Terrain": terrainMap,
		"Stamen Toner": tonerMap,
		"Stamen Watercolor": watercolorMap
	}

	L.control.layers(baseLayers, overlays).addTo(map);
}


function toggle_streets(o) {
	o.layers.overlays.stamen_toner.visible = !o.layers.overlays.stamen_toner.visible;
}
function do_search(o) {
	if (o.queryText && o.queryText.length > 0) {
		console.log('Searching for ' + o.queryText);

		var url = "http://nominatim.openstreetmap.org/search?format=json&q=" + o.queryText;

		$http.get(url).
			success(function (data, status, headers, config) {

				console.log(data);
				o.searchResults = data;

			}).
			error(function (data, status, headers, config) {
				// log error
			});
	}

}

function hallo() {

	var map = M.map = L.map('map', { center: [48.238, 16.344], zoom: 15 });

	let o = {
		queryText: 'Paris',
		searchResults: '',
		defaults: {
			maxZoom: 16
		},
		mapCenter: {
			lat: 48.238,
			lng: 16.344,
			zoom: 15
		},
		layers: {
			baselayers: {
				stamen_watercolor: {
					name: 'watercolor',
					url: "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
					layerOptions: {
						attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
						"showOnSelector": false,
						updateWhenIdle: false,
						reuseTiles: true
					},
					type: 'xyz'
				}
			},
			overlays: {
				stamen_toner: {
					name: 'Show Street Names',
					url: "http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
					layerOptions: {
						attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
						opacity: 0.4,
						"showOnSelector": false,
						detectRetina: true,
						updateWhenIdle: true,
						reuseTiles: true
					},
					type: 'xyz',
					visible: true
				}
			}
		}

	}

	let info = o.layers.baselayers.stamen_watercolor;

	layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', subdomains: ['a', 'b', 'c'] });
	layer.addTo(M.map);
}

function get_layer_satellite() {
	return L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		{ attribution: '&copy; ' + mapLink + ', ' + sourcesLink, maxZoom: 18, });


}









async function NOPE() {
	[M.cities, M.capitals] = await get_cities_and_capitals();

	let map = M.map = map_init(dMap, 'Paris', 17);

	M.baselayer = map_add_layer('watercolor');

	map.on('click', function (e) {
		document.getElementById('dInfo').innerHTML =
			"Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng + '<br>Zoom: ' + map.getZoom();
	});


}


