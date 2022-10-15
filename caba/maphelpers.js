function create_map(o = {}) {
	//defaults: there should be a html div named 'map'
	addKeys({ baselayer: 'satellite', center: Geo.places.tuerkenschanzpark, zoom: 17, id: 'map' }, o)

	M.layers = {};
	let info = Geo.layerInfo[o.baselayer]; o.layers = [isdef(info) ? L.tileLayer(info.url, info.options) : L.tileLayer('')];
	let map = M.map = L.map(o.id, o);

	return map;
}




















