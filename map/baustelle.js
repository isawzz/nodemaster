
function ensure_city_layer(){
	if (!lookup(M,['layers','city'])) map_add_layer('city', M.map);
	return M.layers.city;
}
function map_add_city(o){
	let layer = ensure_city_layer();
	let feature = map_add_circle_to_layer(Number(o.lng), Number(o.lat), layer);
	feature.data = o;
	
	
}

function map_add_layer(key,map){
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [], //[new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 14000))]
		}),
		style: [
			new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'blue',
					width: 3
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 255, 0.1)'
				})
			})
		]
	});
	map.addLayer(layer);	
	lookupSet(M,['layers',key],layer);
	return layer;
}
function map_add_circle_to_layer(longitude,latitude,layer){
	var centerLongitudeLatitude = ol.proj.fromLonLat([longitude, latitude]);
	let source = layer.getSource();
	//console.log('source',source);
	let f=new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 14000));
	let x=source.addFeature(f);
	//console.log('result of addFeature',f);
	return f;
}

function add_circle(longitude,latitude,map){
	var centerLongitudeLatitude = ol.proj.fromLonLat([longitude, latitude]);
	var layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			projection: 'EPSG:4326',
			features: [new ol.Feature(new ol.geom.Circle(centerLongitudeLatitude, 14000))]
		}),
		style: [
			new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: 'blue',
					width: 3
				}),
				fill: new ol.style.Fill({
					color: 'rgba(0, 0, 255, 0.1)'
				})
			})
		]
	});
	map.addLayer(layer);	
}



















