//#region imports
import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';

import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import GeoJSON from 'https://cdn.skypack.dev/ol/format/GeoJSON.js';

import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';

//interactions
import DragAndDrop from 'https://cdn.skypack.dev/ol/interaction/DragAndDrop.js';
import Draw from 'https://cdn.skypack.dev/ol/interaction/Draw.js';
import DoubleClickZoom from 'https://cdn.skypack.dev/ol/interaction/DoubleClickZoom.js';
import Link from 'https://cdn.skypack.dev/ol/interaction/Link.js';
import Modify from 'https://cdn.skypack.dev/ol/interaction/Modify.js';
import Snap from 'https://cdn.skypack.dev/ol/interaction/Snap.js';

//styling
import { Style, Fill, Stroke, Icon } from 'https://cdn.skypack.dev/ol/style'; //'ol/style';
import { getArea } from 'https://cdn.skypack.dev/ol/sphere';

//current position
import Feature from 'https://cdn.skypack.dev/ol/Feature.js';
//import Point from 'https://cdn.skypack.dev/ol/geom/Point.js';
import { circular } from 'https://cdn.skypack.dev/ol/geom/Polygon.js';
import MousePosition from 'https://cdn.skypack.dev/ol/control/MousePosition.js';
//import format from 'https://cdn.skypack.dev/ol/coordinate'; MIST!

import { Polygon, Point, Circle } from 'https://cdn.skypack.dev/ol/geom';


window.Mapping = {};
G = { interactions: {} }; // poly line point snap modify dd 

onload = start;
//#_endregion
//#_region interactions

function add_interaction(key, o) {
	if (isdef(G.interactions[key])) remove_interaction(key);
	if (nundef(o)) {
		let source = G.source;
		if (key == 'poly') {
			o = new Draw({ source: source, type: 'Polygon', });
		} else if (key == 'line') {
			o = new Draw({ source: source, type: 'Line', });
		} else if (key == 'point') {
			o = new Draw({ source: source, type: 'Point', });
		} else if (key == 'snap') {
			o = new Snap({ source: source, });
		} else if (key == 'modify') {
			o = new Modify({ source: source, });
		}
	}
	if (o instanceof Draw) {
		o.on('drawend', function () {
			remove_interaction(key);
			remove_interaction('snap');
			remove_interaction('modify');
		});

	}
	G.interactions[key] = o;
	G.map.addInteraction(o);
}
function clear_interactions() {
	let keys = get_keys(G.interactions);
	for (const k of keys) {
		remove_interaction(k);
	}
}
function remove_interaction(key) {
	let ia = G.interactions[key];
	if (isdef(ia)) {
		G.map.removeInteraction(ia);
		delete G.interactions[key];
	}
}
function activate_drawing() {
	console.log('activate', G)
	add_interaction('poly');
	add_interaction('modify');
	add_interaction('snap');
}
//#endregion
function reset_source() {
	let map = G.map;
	if (isdef(G.source)) {
		clear_interactions();
		G.source.clear();
	}
	let source = G.source = new VectorSource({ format: new GeoJSON(), url: '../olmini/countries.json', });
	G.layer.setSource(source);
	const format1 = new GeoJSON({ featureProjection: 'EPSG:3857' });
	const download = document.getElementById('dDownload');
	source.on('change', function () {
		const features = source.getFeatures();
		const json = format1.writeFeatures(features);
		download.href = 'data:text/json;charset=utf-8,' + json;
	});

	var mousePosition = new MousePosition({
		className: 'mousePosition',
		projection: 'EPSG:4326',
		coordinateFormat: function (coordinate) { let s = format_coords(coordinate); mBy('dMouse').innerHTML = s; return s; } //console.log('coord', s, typeof (coordinate)); return s; } //format(coordinate, '{y} , {x}', 6); }
	});
	map.addControl(mousePosition);

	console.log('navigator', navigator.geolocation);
	let coords = navigator.geolocation.getCurrentPosition(onsuccess, onerror);
}
window.Mapping.add_marker = (coords) => {
	console.log('add a moarker at', coords);
	var iconFeature = new Feature({
		geometry: new Point(coords)
	});

	//add icon to vector source
	G.source.addFeature(iconFeature);
	var iconStyle = new Style({
		image: new Icon(({
			anchor: [0.5, 46],
			anchorXUnits: 'fraction',
			anchorYUnits: 'pixels',
			opacity: 0.9,
			src: '../base/assets/icons/ball.png',
		}))
	});
}
window.Mapping.add_circle = (pos, bg, size, fg) => {
	let di = {
		Redmond: [-122.11, 47.7],
		Vienna: [16.5, 48.2],
	};
	bg = valf(bg, 'lime');
	fg = valf(fg, bg);
	size = valf(size,10000);

	var centerLongitudeLatitude = fromLonLat(valf(di[pos], pos, di.Vienna));
	var layer = new VectorLayer({
		source: new VectorSource({
			projection: 'EPSG:4326',
			features: [new Feature(new Circle(centerLongitudeLatitude, size))]
		}),
		style: [
			new Style({
				stroke: new Stroke({
					color: fg,
					width: 3
				}),
				fill: new Fill({
					color: bg, 
				})
			})
		]
	});
	G.map.addLayer(layer);

}


function start() {

	let map = G.map = new Map({
		target: 'map-container',
		view: new View({
			center: [0, 0],
			zoom: 2,
		}),
	});

	map.addInteraction(new Link());

	let colorfunc = color_by_area(getArea);
	let layer = G.layer = new VectorLayer({
		// source: source,
		style: function (feature) {
			return new Style({
				fill: new Fill({
					color: colorfunc(feature),
				}),
				stroke: new Stroke({
					color: 'rgba(255,255,255,0.8)',
				}),
			});
		},
	});

	map.addLayer(layer);

	reset_source();

	mBy('dClear').onclick = reset_source;
	mBy('dDraw').onclick = activate_drawing;

	//map.addInteraction(new DragAndDrop({ source: source, formatConstructors: [GeoJSON], }));
	//map.addInteraction(new DoubleClickZoom());
	//map.addInteraction(new Snap({ source: source, }));


}








//#region tot
function muell() {
	navigator.geolocation.watchPosition(
		function (pos) {
			const coords = [pos.coords.longitude, pos.coords.latitude];
			const accuracy = circular(coords, pos.coords.accuracy);
			source.clear(true);
			source.addFeatures([
				new Feature(
					accuracy.transform('EPSG:4326', map.getView().getProjection())
				),
				new Feature(new Point(fromLonLat(coords))),
			]);
		},
		function (error) {
			alert(`ERROR: ${error.message}`);
		},
		{
			enableHighAccuracy: true,
		}
	);


}
function _find_interaction(iclass) {
	let [map, source] = [G.map, G.source];
	var dblclickzoom;
	map.getInteractions().forEach(function (interaction) {
		if (interaction instanceof DoubleClickZoom) {
			dblclickzoom = interaction;
		}
	});

	// Remove the interaction from the map.
	if (dblclickzoom) { map.removeInteraction(dblclickzoom); }
}
function _activate_drawing() {

	let [map, source] = [G.map, G.source];

	// Find the double click interaction that is on the map.
	var dblclickzoom;
	map.getInteractions().forEach(function (interaction) {
		if (interaction instanceof DoubleClickZoom) {
			dblclickzoom = interaction;
		}
	});

	// Remove the interaction from the map.
	if (dblclickzoom) { map.removeInteraction(dblclickzoom); }

	/* Add your draw interaction here */
	// var drawinteraction = new ol.interaction.Draw(...);
	var drawinteraction = new Draw({ source: source, type: 'Polygon', });
	var modinteraction = new Modify({ source: source, });
	var snapinteraction = new Snap({ source: source, });

	// I like to stick the listener on the source's change event rather than
	// the interaction's drawend, but I think either should work...
	drawinteraction.on('drawend', function () {
		map.removeInteraction(drawinteraction);
		map.removeInteraction(modinteraction);
		map.removeInteraction(snapinteraction);
		// Do this in a timeout so it doesn't get triggered by the potential
		// double click that caused the drawing to end.
		if (dblclickzoom) {
			setTimeout(function () {
				map.addInteraction(dblclickzoom);
			});
		}
	});
	// Start the draw interaction...
	map.addInteraction(drawinteraction);
	map.addInteraction(modinteraction);
	map.addInteraction(snapinteraction);
}

//#endregion


