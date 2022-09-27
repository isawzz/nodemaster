onload = start;
var map, nav;
function start() {

	test1_openlayers(); //test0_mapbox();
}
function test0_mapbox() {
	mapboxgl.accessToken = "pk.eyJ1IjoidGF3enoiLCJhIjoiY2w4Z25iYmJpMGdmODNvbWw5c2d3enJ5ZSJ9.GcwAMxqmxDwVE665KFCMtQ";
	map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/mapbox/streets-v11",
		zoom: 10,
		center: [16.3738, 48.2082],
	});

	nav = new mapboxgl.NavigationControl(); map.addControl(nav);

	setTimeout(() => { map.flyTo({ zoom: 13 }) }, 2000);

}

import Map from '../node_modules/ol/Map.js';
import View from '../node_modules/ol/View.js';
import TileLayer from '../node_modules/ol/layer/Tile.js';
import XYZ from '../node_modules/ol/source/XYZ.js';

function test1_openlayers() {
	new Map({
		target: 'map',
		layers: [
			new TileLayer({
				source: new XYZ({
					url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
				})
			})
		],
		view: new View({
			center: [0, 0],
			zoom: 2
		})
	});
}

