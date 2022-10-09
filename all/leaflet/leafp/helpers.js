var Geo = {
	locations: {
		Vienna: [48.238, 16.344],
		Bellevue: [47.617, -122.17],
	},

}

function get_layer_options() {
	return {
		"OSM": osmBase,
		"OpenCycleMap": OpenCycleMap,
		"StamenWatercolor": StamenWatercolor,
	};
	return {
		'OpenStreetMap Default': L.tileLayer.provider('OpenStreetMap.Mapnik'),
		'OpenStreetMap German Style': L.tileLayer.provider('OpenStreetMap.DE'),
		'OpenStreetMap H.O.T.': L.tileLayer.provider('OpenStreetMap.HOT'),
		// 'MapTilesAPI OpenStreetMap in English': L.tileLayer.provider('MapTilesAPI.OSMEnglish'),
		// 'MapTilesAPI OpenStreetMap en Français': L.tileLayer.provider('MapTilesAPI.OSMFrancais'),
		// 'MapTilesAPI OpenStreetMap en Español': L.tileLayer.provider('MapTilesAPI.OSMEspagnol'),
		'Thunderforest OpenCycleMap': L.tileLayer.provider('Thunderforest.OpenCycleMap', { apikey: '87e7668535754c798ef4870cadbeb2ab' }),
		'Thunderforest Landscape': L.tileLayer.provider('Thunderforest.Landscape', { apikey: '87e7668535754c798ef4870cadbeb2ab' }),
		'Thunderforest Atlas': L.tileLayer.provider('Thunderforest.Atlas', { apikey: '87e7668535754c798ef4870cadbeb2ab' }),
		'Thunderforest Transport': L.tileLayer.provider('Thunderforest.Transport', { apikey: '87e7668535754c798ef4870cadbeb2ab' }),
		'Stamen Toner': L.tileLayer.provider('Stamen.Toner'),
		'Stamen Terrain': L.tileLayer.provider('Stamen.Terrain'),
		'Stamen Watercolor': L.tileLayer.provider('Stamen.Watercolor'),
		'Jawg Streets': L.tileLayer.provider('Jawg.Streets', { apikey: 'DBmQfjladcdInyiIKKel1mAI428eYlXfZG26VCU6PvwEGLQ1QvoIqCl0k7I41eAv' }),
		'Jawg Terrain': L.tileLayer.provider('Jawg.Terrain', { apikey: 'DBmQfjladcdInyiIKKel1mAI428eYlXfZG26VCU6PvwEGLQ1QvoIqCl0k7I41eAv' }),
		'Jawg Test': L.tileLayer.provider('Jawg.Test', { apikey: 'DBmQfjladcdInyiIKKel1mAI428eYlXfZG26VCU6PvwEGLQ1QvoIqCl0k7I41eAv' }),
		'Esri WorldStreetMap': L.tileLayer.provider('Esri.WorldStreetMap'),
		//'Esri DeLorme': L.tileLayer.provider('Esri.DeLorme'), max zoom 12
		'Esri WorldTopoMap': L.tileLayer.provider('Esri.WorldTopoMap'),
		'Esri WorldImagery': L.tileLayer.provider('Esri.WorldImagery'),
		// 'Esri WorldTerrain': L.tileLayer.provider('Esri.WorldTerrain'), //max zoom 13
		// 'Esri WorldShadedRelief': L.tileLayer.provider('Esri.WorldShadedRelief'),
		// 'Esri WorldPhysical': L.tileLayer.provider('Esri.WorldPhysical'),
		// 'Esri OceanBasemap': L.tileLayer.provider('Esri.OceanBasemap'),
		'Esri NatGeoWorldMap': L.tileLayer.provider('Esri.NatGeoWorldMap'), //gut!
		'Esri WorldGrayCanvas': L.tileLayer.provider('Esri.WorldGrayCanvas'),
		// 'Geoportail France Maps': L.tileLayer.provider('GeoportailFrance'),
		// 'Geoportail France Orthos': L.tileLayer.provider('GeoportailFrance.orthos'),
		// 'USGS USTopo': L.tileLayer.provider('USGS.USTopo'), //only US!
		// 'USGS USImagery': L.tileLayer.provider('USGS.USImagery'),
		// 'USGS USImageryTopo': defaultLayer,

		// OpenSeaMap: L.tileLayer.provider('OpenSeaMap'),
		// 'OpenWeatherMap Clouds': L.tileLayer.provider('OpenWeatherMap.Clouds'),
		// 'OpenWeatherMap CloudsClassic': L.tileLayer.provider('OpenWeatherMap.CloudsClassic'),
		// 'OpenWeatherMap Precipitation': L.tileLayer.provider('OpenWeatherMap.Precipitation'),
		// 'OpenWeatherMap PrecipitationClassic': L.tileLayer.provider('OpenWeatherMap.PrecipitationClassic'),
		// 'OpenWeatherMap Rain': L.tileLayer.provider('OpenWeatherMap.Rain'),
		// 'OpenWeatherMap RainClassic': L.tileLayer.provider('OpenWeatherMap.RainClassic'),
		// 'OpenWeatherMap Pressure': L.tileLayer.provider('OpenWeatherMap.Pressure'),
		// 'OpenWeatherMap PressureContour': L.tileLayer.provider('OpenWeatherMap.PressureContour'),
		// 'OpenWeatherMap Wind': L.tileLayer.provider('OpenWeatherMap.Wind'),
		// 'OpenWeatherMap Temperature': L.tileLayer.provider('OpenWeatherMap.Temperature'),
		// 'OpenWeatherMap Snow': L.tileLayer.provider('OpenWeatherMap.Snow'),
		// 'Geoportail France Parcels': L.tileLayer.provider('GeoportailFrance.parcels'),
		// 'Waymarked Trails Hiking': L.tileLayer.provider('WaymarkedTrails.hiking'),
		// 'Waymarked Trails Cycling': L.tileLayer.provider('WaymarkedTrails.cycling'),
		// 'Waymarked Trails MTB': L.tileLayer.provider('WaymarkedTrails.mtb'),
		// 'Waymarked Trails Ski Slopes': L.tileLayer.provider('WaymarkedTrails.slopes'),
		// 'Waymarked Trails Riding': L.tileLayer.provider('WaymarkedTrails.riding'),
		// 'Waymarked Trails Skating': L.tileLayer.provider('WaymarkedTrails.skating'),

	}
}

function toggle_layers_control() {
	if (DA.layers_control) { M.map.removeControl(DA.layers_control); DA.layers_control = null; } //
	else {
		let baseLayers = get_layer_options();
		let overlayLayers = get_layer_options();
		DA.layers_control = L.control.layers(baseLayers, overlayLayers, { collapsed: false })
		DA.layers_control.addTo(M.map);
	}
}

function create_map() {

	//let dTools = mDiv('dInfo',{float:'right',margin:10},'dInfo')

	var map = M.map = L.map('map', { center: Geo.locations.Vienna, zoom: 15 });
	var defaultLayer = L.tileLayer.provider('Stamen.Watercolor').addTo(map);

	var button = mButton('layers', toggle_layers_control, 'dInfo', { hmargin: 10 });

	map.on('click', function (e) {
		document.getElementById('dInfo').innerHTML =
			"Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng + '<br>Zoom: ' + map.getZoom();
	});

}






















