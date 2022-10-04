onload = start;

function start() {
	var map = new ol.Map({
		target: 'map1',
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM(),
			}),
		],
		view: new ol.View({
			center: ol.proj.fromLonLat([16, 48]),
			zoom: 13,
		}),
	});

	let a=mBy('question');
	a.href='https://api.opencagedata.com/geocode/v1/json?key=272acb1dd4714474a25ac4c60b588688&q=52.3877830%2C+9.7334394&pretty=1&no_annotations=1';

	return;

	// geosearch options
	var options = {
		key: '272acb1dd4714474a25ac4c60b588688',
		// you will need to become a customer to get a geosearch key
		// language: 'fr',
		// onSelect: (params) => { console.log('hello from onSelect', params) },
		position: 'topright',
	};

	// add geosearch to the map
	var controlGeosearch = new OpenCageGeosearchControl(options);
	console.log('controlGeosearch',controlGeosearch)
	//map.addControl(controlGeosearch);


}
