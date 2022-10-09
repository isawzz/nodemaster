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
import { Polygon, Point, Circle } from 'https://cdn.skypack.dev/ol/geom';
//#endregion

window.Mapping = {};
var source = null;
var map = null;

window.Mapping.add_color_layer = ()=>{
	const min = 1e8; // the smallest area
	const max = 2e13; // the biggest area
	const steps = 50;
	const ramp = createColormap({
		colormap: 'blackbody',
		nshades: steps,
	});
	console.log('ramp',ramp)
	
	function clamp(value, low, high) {
		return Math.max(low, Math.min(value, high));
	}
	
	function getColor(feature) {
		const area = getArea(feature.getGeometry());
		const f = Math.pow(clamp((area - min) / (max - min), 0, 1), 1 / 2);
		const index = Math.round(f * (steps - 1));
		return ramp[index];
	}	
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
}
window.Mapping.set_style = (bg, fg) => {
	const layer = new VectorLayer({
		source: source,
		style: new Style({
			fill: new Fill({
				color: 'orange',
			}),
			stroke: new Stroke({
				color: 'white',
			}),
		}),
	});
	map.addLayer(layer);
}
window.Mapping.clear_source = () => {
	if (source) source.clear();
}
window.Mapping.create_map = function (type = 'OSM') {
	mClear('map-container');
	if (type == 'geo') {
		map = new Map({
			target: 'map-container',
			layers: [
				new VectorLayer({
					source: new VectorSource({
						format: new GeoJSON(),
						url: '../olmini/countries.json',
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
window.Mapping.add_circle = () => {
	const Redmond = [-122.11, 47.7];
	const Vienna = [16.5, 48.2];

	var centerLongitudeLatitude = fromLonLat(Redmond);
	var layer = new Vector({
		source: new Vector({
			projection: 'EPSG:4326',
			features: [new Feature(new Circle(centerLongitudeLatitude, 4000))]
		}),
		style: [
			new Style({
				stroke: new Stroke({
					color: 'blue',
					width: 3
				}),
				fill: new Fill({
					color: 'rgba(0, 0, 255, 0.1)'
				})
			})
		]
	});
	map.addLayer(layer);

}















