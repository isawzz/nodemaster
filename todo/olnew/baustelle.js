function color_by_area(area_func) {
	//returns a function that sets color according to area given geojson feature object
	const min = 1e8; // the smallest area
	const max = 2e13; // the biggest area
	const steps = 50;
	const ramp = createColormap({
		colormap: 'blackbody',
		nshades: steps,
	});
	//console.log('ramp', ramp)

	function clamp(value, low, high) {
		return Math.max(low, Math.min(value, high));
	}

	function getColor(feature) {
		let geo=feature.getGeometry();
		//let isPoly = geo instanceof Polygon;
		//console.log('is it a Polygon?',geo.constructor.name); //,isPoly);		if (!isPoly) return '#000';
		//if (geo.constructor.name.includes('Polygon')){console.log('YEAHHH!!!!')}
		let isPoly = geo.constructor.name.includes('Polygon');
		if (!isPoly) { console.log('not a poly',geo.constructor.name); return '#ff0';}
		const area = area_func(feature.getGeometry());
		const f = Math.pow(clamp((area - min) / (max - min), 0, 1), 1 / 2);
		const index = Math.round(f * (steps - 1));
		return ramp[index];
	}
	return getColor;
}
function format_coords(coords) { return coords[0].toFixed(2) + ',' + coords[1].toFixed(2); }
function onerror(x) { console.log('error') }
function onsuccess(x) {
	console.log('success!!!', x, typeof x);
	Mapping.add_circle([x.coords.longitude,x.coords.latitude]);
}























