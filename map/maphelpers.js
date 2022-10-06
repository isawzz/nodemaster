
function color_by_area(colormap_name = 'autumn') {
	//returns a function that sets color according to area given geojson feature object
	const min = 1e8; // the smallest area
	const max = 2e13; // the biggest area
	const steps = 50;
	const ramp = colorMap({
		colormap: colormap_name,
		nshades: steps,
	});
	//console.log('ramp', ramp)

	function clamp(value, low, high) {
		return Math.max(low, Math.min(value, high));
	}

	function getColor(feature) {
		let geo = feature.getGeometry(); let type = geo.getType();
		//console.log('geo',geo)
		//let isPoly = geo instanceof Polygon;
		//console.log('is it a Polygon?',geo.constructor.name); //,isPoly);		if (!isPoly) return '#000';
		//if (geo.constructor.name.includes('Polygon')){console.log('YEAHHH!!!!')}
		let isPoly = type.includes('Polygon'); // geo.constructor.name.includes('Polygon');
		if (!isPoly) { console.log('not a poly', type); return '#ff0'; }
		const area = ol.sphere.getArea(feature.getGeometry());
		//console.log('area',feature._values,area)
		const f = Math.pow(clamp((area - min) / (max - min), 0, 1), 1 / 2);
		const index = Math.round(f * (steps - 1));
		return ramp[index];
	}
	return getColor;
}
function capitals_in_red(feature) {
	console.log('feature data', feature.data);
	let type = lookup(feature, ['data', 'type']);
	console.log('city', lookup(feature, ['data', 'name']), ':', type)
	return type == 'capital' ? 'red' : 'yellow';
}
function get_style_func(func, bg, fg) {
	let res = (feature) => {
		return new ol.style.Style({
			fill: new ol.style.Fill({
				color: valf(func(feature), bg)
			}),
			stroke: new ol.style.Stroke({
				color: fg,
			}),
		});
	}
	return res;
}
function get_style(bg, fg) {
	let res = new ol.style.Style({
		fill: new ol.style.Fill({ color: bg }),
		stroke: new ol.style.Stroke({ color: fg }),
	});

	return res;
}
async function get_cities_and_capitals() {
	let cities = await route_path_yaml_dict('../base/mapdata/cities.yaml');

	//console.log('cities',cities)

	let res = {}; let capitals = [];
	for (const c in cities) {
		let s = cities[c];
		let ws = s.split(',').map(x => x.trim());
		res[c] = { name: c, lon: Number(ws[0]), lat: Number(ws[1]), country: ws[2], type: ws[3], pop: Number(ws[4]) };

		if (res[c].type == 'capital') capitals.push(c);
		//`${o.lng},${o.lat},${o.country},${o.capital},${o.population}`
	}
	return [res, capitals];
}
function set_style_from_options(layer, options={}) {
	let style = isdef(options.colorfunc) ? get_style_func(options.colorfunc, valf(options.bg, 'lime'), valf(options.fg, 'orange'))
		: get_style(valf(options.bg, 'yellow'), valf(options.fg, 'yellow'));
	layer.setStyle(style);

}

function map_add_object(o, options={}) {
	let layer = valf(options.layer, M.map.getLayers()[0]);

	//console.log('o',o)
	let [lon, lat] = [valf(options.lon, o.lon, 16), valf(options.lat, o.lat, 48)];

	let shape = valf(options.shape, 'circle');
	let center = ol.proj.fromLonLat([lon, lat]);

	//circle:
	let feature;
	switch (shape) {
		default: feature = new ol.Feature({ geometry: new ol.geom.Circle(center, 25000), data: o }); break;
	}

	layer.getSource().addFeature(feature);
	return feature;

}
function map_add_layer(options = {}) {
	let map = M.map;
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [],
		}),
	});
	set_style_from_options(layer, options);
	map.addLayer(layer);
	if (isdef(options.key)) lookupSet(M, ['layers', key], layer);
	return layer;
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
function map_init(options) {
	const layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			url: valf(options.url, '../base/mapdata/countries.json'),
			format: new ol.format.GeoJSON(),
		}),
		background: valf(options.ocean, DARKBLUE),
		//style: get_style(BLUE,RED),
		//style: get_style_func(color_by_area(options.colormap),valf(options.bg,'lime'),valf(options.fg,'orange')),
	});

	set_style_from_options(layer, options);

	return new ol.Map({
		layers: [layer],
		target: 'map-container',
		view: new ol.View({
			center: [0, 0],
			zoom: valf(options.zoom, 2),
		}),
	});

}
























