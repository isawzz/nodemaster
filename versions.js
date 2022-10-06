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

	let style = isdef(options.colorfunc) ? get_style_func(options.colorfunc, valf(options.bg, 'lime'), valf(options.fg, 'orange'))
		: get_style(valf(options.bg, 'lime'), valf(options.fg, 'orange'));
	layer.setStyle(style);

	return new ol.Map({
		layers: [layer],
		target: 'map-container',
		view: new ol.View({
			center: [0, 0],
			zoom: 2,
		}),
	});

}




























