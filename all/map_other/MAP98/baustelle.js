
function get_layers() {
	// create hash to hold all layers
	let x = L.Control.Layers;
	let y = x._layers;
	console.log('layers',y,'was ist x',x);
	return;
	var control, layers;
	layers = {};
	control = this;

	// loop thru all layers in control
	control._layers.forEach(function (obj) {
		var layerName;
		console.log('obj', obj)
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
















