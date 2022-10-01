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
//#endregion

const data = window.Mapping = {};
var source = null;

window.Mapping.clear_source = () => {
	if (source) source.clear();
}
window.Mapping.create_map = function (type = 'OSM') {
	let map;
	mClear('map-container');
	if (type == 'geo') {
		map = new Map({
			target: 'map-container',
			layers: [
				new VectorLayer({
					source: new VectorSource({
						format: new GeoJSON(),
						url: './data/countries.json',
					}),
				}),
			],
			view: new View({ center: [0, 0], zoom: 2, }),
		});
	} else if (type == 'OSM') {
		map = new Map({
			target: 'map-container',
			layers: [
				new TileLayer({
					source: new OSM(),
				}),
			],
			view: new View({ center: fromLonLat([0, 0]), zoom: 2, }),
		});

	}
	map.addInteraction(new Link()); //jetzt bleibt center immer gleich wenn andere source reloade!

	source = new VectorSource();
	const layer = new VectorLayer({
		source: source,
	});
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
			type: 'Polygon',
			source: source,
		})
	);

	map.addInteraction(
		new Snap({
			source: source,
		})
	);

	const format = new GeoJSON({ featureProjection: 'EPSG:3857' });
	const download = document.getElementById('dDownload');
	source.on('change', function () {
		const features = source.getFeatures();
		const json = format.writeFeatures(features);
		download.href =
			'data:application/json;charset=utf-8,' + encodeURIComponent(json);
	});

	return map;
}
















