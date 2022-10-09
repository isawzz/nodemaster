// import DragAndDrop from 'ol/interaction/DragAndDrop';
// import Draw from 'ol/interaction/Draw';
// import GeoJSON from 'ol/format/GeoJSON';
// import Link from 'ol/interaction/Link';
// import Map from 'ol/Map';
// import Modify from 'ol/interaction/Modify';
// import Snap from 'ol/interaction/Snap';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import View from 'ol/View';
// import {Fill, Stroke, Style} from 'ol/style';
// //! [imports]
// import colormap from 'colormap';
// import {getArea} from 'ol/sphere';
// //! [imports]
//#region imports
import Map from 'https://cdn.skypack.dev/ol/Map.js';
import View from 'https://cdn.skypack.dev/ol/View.js';
import TileLayer from 'https://cdn.skypack.dev/ol/layer/Tile.js';
import OSM from 'https://cdn.skypack.dev/ol/source/OSM.js';
import GeoJSON from 'https://cdn.skypack.dev/ol/format/GeoJSON.js';
import VectorLayer from 'https://cdn.skypack.dev/ol/layer/Vector.js';
import VectorSource from 'https://cdn.skypack.dev/ol/source/Vector.js';
import DragAndDrop from 'https://cdn.skypack.dev/ol/interaction/DragAndDrop.js';
import Draw from 'https://cdn.skypack.dev/ol/interaction/Draw.js';
import Link from 'https://cdn.skypack.dev/ol/interaction/Link.js';
import Modify from 'https://cdn.skypack.dev/ol/interaction/Modify.js';
import Snap from 'https://cdn.skypack.dev/ol/interaction/Snap.js';
import { fromLonLat } from 'https://cdn.skypack.dev/ol/proj.js';
import { Style, Fill, Stroke } from 'https://cdn.skypack.dev/ol/style'; //'ol/style';
import { getArea } from 'https://cdn.skypack.dev/ol/sphere';
//#endregion

onload = start;

function start() {
	//! [color]
	const min = 1e8; // the smallest area
	const max = 2e13; // the biggest area
	const steps = 50;
	const ramp = createColormap({
		colormap: 'blackbody',
		nshades: steps,
	});
	console.log('ramp', ramp)

	function clamp(value, low, high) {
		return Math.max(low, Math.min(value, high));
	}

	function getColor(feature) {
		const area = getArea(feature.getGeometry());
		const f = Math.pow(clamp((area - min) / (max - min), 0, 1), 1 / 2);
		const index = Math.round(f * (steps - 1));
		return ramp[index];
	}
	//! [color]

	const map = new Map({
		target: 'map-container',
		view: new View({
			center: [0, 0],
			zoom: 2,
		}),
	});

	map.addInteraction(new Link());

	//const source = new VectorSource();
	const source = new VectorSource({ format: new GeoJSON(), url: '../olmini/countries.json', });

	//! [style]
	const layer = new VectorLayer({
		source: source,
		style: function (feature) {
			return new Style({
				fill: new Fill({
					color: getColor(feature),
				}),
				stroke: new Stroke({
					color: 'rgba(255,255,255,0.8)',
				}),
			});
		},
	});
	//! [style]

	map.addLayer(layer);

	map.addInteraction(
		new DragAndDrop({
			source: source,
			formatConstructors: [GeoJSON],
		})
	);

	map.addInteraction(
		new Modify({
			source: source,
		})
	);

	map.addInteraction(
		new Draw({
			source: source,
			type: 'Polygon',
		})
	);

	map.addInteraction(
		new Snap({
			source: source,
		})
	);

	const clear = document.getElementById('dClear');
	clear.addEventListener('click', function () {
		source.clear();
	});

	const format = new GeoJSON({ featureProjection: 'EPSG:3857' });
	const download = document.getElementById('dDownload');
	source.on('change', function () {
		const features = source.getFeatures();
		const json = format.writeFeatures(features);
		download.href = 'data:text/json;charset=utf-8,' + json;
	});

}
