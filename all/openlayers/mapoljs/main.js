// import './style.css';
// import { Map, View } from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';

const map = new ol.Map({
	target: 'map',
	layers: [
		ol.TileLayer({
			source: ol.OSM
		})
	],
	view: new ol.View({
		center: [0, 0],
		zoom: 2
	})
});
