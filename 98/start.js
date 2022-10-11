onload = start;

async function start() {

	let [cities, capitals] = await get_cities_and_capitals();

	let center = [47.5951,-122.1535]; //cities.Vienna.center;
	let map = L.map('map').setView(center, 17);

	let baseLayers = {}, overlays = {};
	for (const k of ['empty', 'terrainbg', 'watercolor', 'osm', 'topo', 'satellite', 'gsatellite', 'gterrain']) {
		baseLayers[k] = get_layer(k, { opacity: 1 }); //.addTo(map);
	}
	for (const k of ['labels', 'osm']) {
		overlays[k] = get_layer(k, { opacity: .5 }); //.addTo(map);
	}

	M.control = L.control.layers(baseLayers, overlays).addTo(map);
	baseLayers.satellite.addTo(map);

	//map.add_circle = (center,options)=>add_circle_to(map,center,options);
	var circle = get_circle(center, { sz: 1000 }); circle.addTo(map);

	M.map = map;

	L.Control.Layers.include({
		getOverlays: function () {
			// create hash to hold all layers
			var control, layers;
			layers = {};
			control = this;

			// loop thru all layers in control
			control._layers.forEach(function (obj) {
				var layerName;

				// check if layer is an overlay
				if (obj.overlay) {
					// get name of overlay
					layerName = obj.name;
					// store whether it's present on the map or not
					return layers[layerName] = control._map.hasLayer(obj.layer);
				}
			});

			return layers;
		}
	});

}

function updateOpacity(value) {
	let x = M.control.getOverlays(); // { Truck 1: true, Truck 2: false, Truck 3: false }
	console.log('layers',x)




	var interactive_layer = L.LayerGroup().getLayers()[0]; //In case you are using layer group. Also if you define the Layer group as Global variable, then you can call getLayers() directly.
	if (interactive_layer != undefined)
		interactive_layer.setOpacity(value);
}

